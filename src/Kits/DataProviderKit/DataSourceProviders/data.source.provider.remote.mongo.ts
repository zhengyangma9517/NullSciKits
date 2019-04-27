import { DataSourceProviderRemote } from './data.source.provider.remote';
import { Configurations, MagicShow, ConfigSections, IMagicShow, MagicShowFactory, SpellStyle, IMongoParams, MongoOption } from 'magetaro';
import { JustDetective } from 'justtools';

export namespace MongoDataProvider {
    export class DataSourceProviderMongo extends DataSourceProviderRemote {
        // private mongoInstance;
        private credentials: any;
        private config: Configurations;
        private sourceManager: MagicShow;

        public constructor(config: Configurations) {
            super('MongoProvider');
            this.config = config;
            this.credentials = {
                url: this.config.getSource(ConfigSections.Connections).mongo.url,
                database: this.config.getSource(ConfigSections.Connections).mongo.database
            };
            const showConfig: IMagicShow = {
                id: 'MongoShow',
                style: SpellStyle.MongoMagic
            };
            this.sourceManager = MagicShowFactory(showConfig);
        }

        public async find(query: any, collection: string, limit?: number, project?: any) {
            const options: IMongoParams = {
                query: query,
                collectname: collection,
                credentials: this.credentials,
                option: MongoOption.Find
            };
            if (JustDetective.simpleDetect(limit)) {
                options.limit = limit;
            }
            if (JustDetective.simpleDetect(project)) {
                options.project = project;
            }
            this.sourceManager.setInput(options);
            await this.sourceManager.itsShowTime();
            this.addData({
                key: collection,
                value: this.sourceManager.getOutput()
            });
        }

        public async insertMany(documents: any[], collection: string) {
            const options: IMongoParams = {
                query: {},
                collectname: collection,
                credentials: this.credentials,
                option: MongoOption.InsertMany,
                documents: documents
            };
            this.sourceManager.setInput(options);
            await this.sourceManager.itsShowTime();
            this.addData({
                key: collection,
                value: this.sourceManager.getOutput()
            });
        }

        public async clear() {
            this.clearData();
            await this.sourceManager.clearCache();
        }
    }
}
