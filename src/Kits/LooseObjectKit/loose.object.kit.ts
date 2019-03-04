import { Models } from '../../models/datasource';

export namespace LooseObject {
    export class LooseObjKit {
        private object: Models.ILooseObj = {};

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
}
