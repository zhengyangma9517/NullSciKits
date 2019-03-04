import { Pool, PoolConfig, PoolClient, Client } from 'pg';
import { Configurations, ConfigSections } from 'magetaro';
import { JustDetective } from 'justtools';
import { TransResultDecoder, TransDecoderType } from '../transaction.result.decoder';
import { Models } from '../../../../models/models';
import { StarQuery } from '../../../../Utils/starquery';

export interface IConnected {
    done: any;
    client: PoolClient;
}

export enum TransactionResult {
    Rolledback = 'rolled back'
}

export enum TransactionMode {
    StarMode,
    AsyncMode,
    SyncMode
}

// Transaction Manager Where Alows You To DO PostGre TranSaction Operations.
// Alpha version is a test demo, there are still a lot of features not complete yet.
export class TransactionManager {

    private pool: Pool;

    private session: IConnected | null = null;

    private toExcuteQuery: Models.IMapSource[];

    private result: Models.IMapSource[] = [];

    private mode: TransactionMode;

    private config: Configurations;

    /**
     * pool, syncMode
     */
    public constructor(pool: Pool, config: Configurations, mode = TransactionMode.SyncMode) {
        this.pool = pool;
        this.toExcuteQuery = [];
        this.mode = mode;
        this.config = config;
    }

    public addToExcuteQuery(str: string, key: string = 'default'): void {
        this.toExcuteQuery.push({ key: key, value: str });
    }

    public getToExcuteQuery(): Models.IMapSource[] {
        return this.toExcuteQuery;
    }

    public getResult(dataType: TransDecoderType): Models.IMapSource[] {
        const output: any[] = [];
        switch (dataType) {
            case TransDecoderType.Postgre: {
                this.result.map((v: Models.IMapSource) => {
                    output.push({ key: v.key, value: v.value.rows });
                });
                break;
            }
        }
        return output;
    }

    public addResult(v: any, key: string): void {
        this.result.push({ key: key, value: v });
    }

    public clearResult() {
        this.result = [];
    }

    public clearQuery() {
        this.toExcuteQuery = [];
    }

    public switchMode(mode: TransactionMode) {
        this.mode = mode;
    }

    public release() {
        this.clearQuery();
        this.clearResult();
        this.releaseSession();
        this.log('TransactionManager: Manager Cache Cleared');
    }

    public setSession(connected: IConnected): void {
        this.session = connected;
        this.log('TransactionManager: Session Set');
    }

    public log(content: string | number): void {
        this.config.logger.info(content);
    }

    public getConfig() {
        return this.config;
    }

    public async connect(): Promise<any> {
        try {
            const connectTask = this.promiseConnectTask();
            const connection: IConnected = await connectTask();
            this.setSession(connection);
            return;
        } catch (e) {
            return;
        }
    }

    // release session, 非纯函数
    public releaseSession() {
        if (JustDetective.simpleDetect(this.session)) {
            this.session!.done();
            this.clearQuery();
            this.log('TransactionManager: Session Released');
        } else {
            this.clearQuery();
            this.log('TransactionManager: Session Is Empty');
        }
    }

    // 用 closure 闭包保留语法环境
    /**
     *
     * @param client pool 连接成功后返回的连接客户端
     * @param querySyntax 本次异步任务将要执行的sql语句
     */
    public promiseQueryTask(client: PoolClient, querySyntax: string): any {
        const toExcuteFunction = async () => {
            const queryString = querySyntax;
            const promise = await new Promise((resolve, reject) => {
                client.query(queryString, (err, res) => {
                    if (err) {
                        console.error('TransactionManager: Query Error', err.stack);
                        reject(err);
                        return;
                    }
                    resolve(res);
                    return;
                });
            });
            return promise;
        };
        return toExcuteFunction;
    }

    public promiseConnectTask(): any {
        const toExcuteFunction = async () => {
            return await new Promise((resolve, reject) => {
                this.pool.connect((err, client, done) => {
                    if (err) {
                        console.error('TransactionManager: Connect Error', err.stack);
                        reject(err);
                    } else {
                        this.log('TransactionManager: Connect Succeed');
                        resolve({ client: client, done: done });
                    }
                });
            });
        };
        return toExcuteFunction;
    }

    public promiseRollbackTask(client: PoolClient): any {
        const toExcuteFunction = async () => {
            return await new Promise((resolve, reject) => {
                client.query('ROLLBACK', (rollbackErr) => {
                    if (rollbackErr) {
                        console.error('TransactionManager: Error rolling back', rollbackErr.stack);
                        this.clearResult();
                        this.addResult(TransactionResult.Rolledback, 'rollback');
                        reject(rollbackErr);
                    } else {
                        this.log('TransactionManager: Rollback Succeed');
                        this.clearResult();
                        this.addResult(TransactionResult.Rolledback, 'rollback');
                        resolve('Rollback Succeed');
                    }
                });
            });
        };
        return toExcuteFunction;
    }

    public promiseBeginTask(client: PoolClient): any {
        const toExcuteFunction = async () => {
            return await new Promise((resolve, reject) => {
                client.query('BEGIN', (beginErr) => {
                    if (beginErr) {
                        console.error('TransactionManager: Error beginning transaction', beginErr.stack);
                        reject(beginErr);
                    } else {
                        this.log('TransactionManager: Begin Succeed');
                        resolve('Begin Succeed');
                    }
                });
            });
        };
        return toExcuteFunction;
    }

    public promiseCommitTask(client: PoolClient): any {
        const toExcuteFunction = async () => {
            return await new Promise((resolve, reject) => {
                client.query('COMMIT', (commitErr) => {
                    if (commitErr) {
                        console.error('TransactionManager: Error committing transaction', commitErr.stack);
                        reject(commitErr);
                    }
                    this.log('TransactionManager: Commit Succeed');
                    resolve('Commit Succeed');
                    return;
                });
            });
        };
        return toExcuteFunction;
    }

    // 非纯函数
    public async excuteQuery(): Promise<any> {
        if (this.getToExcuteQuery().length > 0) {
            const connectedSession = this.session!;
            if (JustDetective.simpleDetect(connectedSession)) {
                const tasks: any[] = [];
                this.getToExcuteQuery().map((query: Models.IMapSource) => {
                    tasks.push(this.promiseQueryTask(connectedSession!.client, query.value));
                });
                try {
                    await this.promiseBeginTask(connectedSession.client)();
                    switch (this.mode) {
                        case TransactionMode.SyncMode: {
                            this.log('TransactionManager: Sync Mode');
                            for (let i = 0; i < tasks.length; i++) {
                                const res = await tasks[i]();
                                this.addResult(res, this.getToExcuteQuery()[i].key);
                            }
                            break;
                        }
                        case TransactionMode.AsyncMode: {
                            this.log('TransactionManager: Async Mode');
                            const ress: any[] = await Promise.all(tasks.map((task) => task()));
                            ress.map((res: any) => {
                                this.addResult(res, this.getToExcuteQuery()[ress.indexOf(res)].key);
                            });
                            break;
                        }
                        case TransactionMode.StarMode: {
                            this.log('TransactionManager: Star Mode');
                            for (let i = 0; i < tasks.length; i++) {
                                if (i > 0) {
                                    if (JustDetective.simpleDetect(this.getToExcuteQuery()[i].value)
                                        && JustDetective.simpleDetect(this.result[i - 1].value.rows[0])) {
                                        this.getToExcuteQuery()[i].value =
                                            StarQuery.starToCommon(this.getToExcuteQuery()[i].value, this.result[i - 1].value.rows[0]);
                                        tasks[i] = this.promiseQueryTask(connectedSession!.client, this.getToExcuteQuery()[i].value);
                                        const res = await tasks[i]();
                                        this.addResult(res, this.getToExcuteQuery()[i].key);
                                    }
                                } else {
                                    const res = await tasks[i]();
                                    this.addResult(res, this.getToExcuteQuery()[i].key);
                                }
                            }
                            break;
                        }
                    }
                    this.log('TransactionManager: Query Finished');
                    await this.promiseCommitTask(connectedSession.client)();
                } catch (e) {
                    console.log(e.stack);
                    await this.promiseRollbackTask(connectedSession.client)();
                    return 'TransactionManager: Error occurred, roll back';
                }
                this.log('TransactionManager: Transaction Succeed');
                return 'TransactionManager: Transaction Succeed';
            } else {
                this.log('TransactionManager: Null Connection');
                return 'TransactionManager: Null Connection';
            }
        } else {
            this.log('TransactionManager: Empty Task');
            return 'TransactionManager: Empty Task';
        }
    }
}
