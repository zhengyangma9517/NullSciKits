import { DataSourceProvider, DataSourceType } from './data.source.provider';

export class DataSourceProviderRemote extends DataSourceProvider {
    constructor(name: string) {
        super(name, DataSourceType.Remote);
        // if (JustDetective.simpleDetect(instance)) {
        //     this.remoteInstance = instance;
        // } else { this.remoteInstance = null; }
    }
}
