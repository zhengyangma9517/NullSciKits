import { Models } from '../../../models/models';

export enum DataSourceType {
    Remote,
    Local
}

export abstract class DataSourceProvider {
    private name: string;
    private sourceType: DataSourceType;
    private data: Models.IMapSource[];
    constructor(name: string, sourceType: DataSourceType) {
        this.name = name;
        this.sourceType = sourceType;
        this.data = [];
    }
    public getData() {
        return this.data;
    }
    public addData(data: Models.IMapSource) {
        this.data.push(data);
    }
    public clearData() {
        this.data = [];
    }
    public getDataByKey(key: string) {
        return this.data.find((data: Models.IMapSource) => data.key === key)!.value;
    }
}
