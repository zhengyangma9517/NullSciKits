import { IMapSource } from '../../../models/datasource';

export enum DataSourceType {
    Remote,
    Local
}

export abstract class DataSourceProvider {
    private name: string;
    private sourceType: DataSourceType;
    private data: IMapSource[];
    constructor(name: string, sourceType: DataSourceType) {
        this.name = name;
        this.sourceType = sourceType;
        this.data = [];
    }
    public getData() {
        return this.data;
    }
    public addData(data: IMapSource) {
        this.data.push(data);
    }
    public clearData() {
        this.data = [];
    }
    public getDataByKey(key: string) {
        return this.data.find((data: IMapSource) => data.key === key)!.value;
    }
}
