import { ILooseObj } from '../../../models/looseobject';

export class LooseObjKit {
    private object: ILooseObj = {};

    public constructor() {
        this.object = {};
    }

    public setAttr(key: string, content: any) {
        this.object[key] = content;
    }

    public deleAttr(key: string) {
        delete this.object[key];
    }

    public get() {
        return this.object;
    }
}
