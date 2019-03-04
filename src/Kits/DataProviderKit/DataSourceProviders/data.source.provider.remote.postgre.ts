import { DataSourceProviderRemote } from './data.source.provider.remote';
import { TransactionManager, TransactionMode } from '../Transactions/PostgreSQLTransactions/transaction.manager.alpha';
import { Pool } from 'pg';
import { Configurations } from 'magetaro';
import { TransDecoderType } from '../Transactions/transaction.result.decoder';
import { Models } from '../../../models/datasource';

export namespace PgDataProvider {
    export class DataSourceProviderPostgre extends DataSourceProviderRemote {
        protected sourceManager: TransactionManager;
        private config: Configurations;
        private pool: Pool;
        // private mongoInstance;
        // private credentials;
        /**

     * @param pool
     * @param config
     */
        public constructor(pool: Pool, config: Configurations) {
            super('PostgreProvider');
            this.sourceManager = new TransactionManager(pool, config, TransactionMode.SyncMode);
            this.config = config;
            this.pool = pool;
        }

        public getManager() {
            return this.sourceManager;
        }

        public addQuery(query: string, key: string = 'postgre') {
            this.sourceManager.addToExcuteQuery(query, key);
        }

        public async fetch() {
            try {
                this.sourceManager.clearResult();
                await this.sourceManager.connect();
                await this.sourceManager.excuteQuery();
                const result: Models.IMapSource[] = this.sourceManager.getResult(TransDecoderType.Postgre);
                // console.log(result);
                result.map((source: Models.IMapSource) => {
                    this.addData(source);
                });
            } catch (e) {
                throw e;
            }
        }

        public async clear() {
            this.sourceManager.clearQuery();
            this.sourceManager.clearResult();
            this.clearData();
        }
    }

}
