import { DataSourceProvider, DataSourceType } from './data.source.provider';
// import { JustDetective } from 'justtools';

export class DataSourceProviderRemote extends DataSourceProvider {
    constructor(name: string) {
        super(name, DataSourceType.Remote);
        // if (JustDetective.simpleDetect(instance)) {
        //     this.remoteInstance = instance;
        // } else { this.remoteInstance = null; }
    }
}
