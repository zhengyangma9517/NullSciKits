export namespace Models {
    /**
     * generic
     * key: string, value: any
    */
    export interface IKeyValue<T> {
        key: string;
        value: T;
    }

    /**
     * generic
     * key: string, value: data[]
    */
    export interface IDataSource<T> {
        key: string;
        data: T[];
    }

    /**
     * generic
    */
    export interface ILooseMapObj<T> {
        [key: string]: T;
    }
}
