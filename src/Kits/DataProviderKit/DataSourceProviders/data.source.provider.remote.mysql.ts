import { DataSourceProviderRemote } from './data.source.provider.remote';
import { MagicShow, Configurations, ConfigSections, IMagicShow, SpellStyle, MagicShowFactory, IMysqlParams } from 'magetaro';

export namespace MysqlDataProvider {
    export class DataSourceProviderMysql extends DataSourceProviderRemote {
        private sourceManager: MagicShow;
        private credentials: any;
        private config: Configurations;

        public constructor(config: Configurations) {
            super('MysqlProvider');
            this.config = config;
            const mysqlConfig = this.config.getSource(ConfigSections.Connections).mysql;
            this.credentials = {
                connectionLimit: mysqlConfig.connections,
                host: mysqlConfig.host,
                user: mysqlConfig.user,
                password: mysqlConfig.password,
                database: mysqlConfig.database
            };
            const showConfig: IMagicShow = {
                id: 'MysqlShow',
                style: SpellStyle.MysqlMagic
            };
            this.sourceManager = MagicShowFactory(showConfig);
        }

        public async fetch(query: string) {
            const params: IMysqlParams = {
                query: query,
                credentials: this.credentials
            };
            this.sourceManager.setInput(params);
            await this.sourceManager.itsShowTime();
            this.addData({
                key: this.credentials.database,
                value: this.sourceManager.getOutput()
            });
            this.sourceManager.clearOutput();
        }

        public async clear() {
            await this.sourceManager.clearCache();
            this.clearData();
        }
    }

}
