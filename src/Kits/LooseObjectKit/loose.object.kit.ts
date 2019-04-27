import { Models } from '../../models/models';

export namespace LooseObject {
    export class LooseObjKit {
        private object: Models.ILooseMapObj<any> = {};

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
