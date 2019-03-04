import * as rp from 'request-promise';

import { DataSourceProviderRemote } from './data.source.provider.remote';
import { LooseObject } from '../../LooseObjectKit/loose.object.kit';
import { Models } from '../../../models/datasource';
import { JustDetective } from 'justtools';

export namespace HttpDataProvider {
    export enum ParamType {
        Json,
        URLEncode,
        // Form
    }
    export enum MethodType {
        Get,
        Post,
        Patch
    }

    export interface IHttpProviderResult {
        headers: any;
        body: any;
    }

    /**
     * only Get And Post Works So far
     */
    export class DataSourceProviderHttp extends DataSourceProviderRemote {
        private headers: LooseObject.LooseObjKit = new LooseObject.LooseObjKit();
        private uri: string | null = null;
        private postBody: any;
        private urlParams: Models.IMapSource[] = [];
        private paramType: ParamType = ParamType.URLEncode;
        private method: MethodType = MethodType.Get;

        public constructor() {
            super('HttpProvider');
        }

        public setHeaders(headers: Models.IMapSource[]) {
            headers.map((header: Models.IMapSource) => {
                this.headers.setAttr(header.key, header.value);
            });
        }

        public setUri(uri: string) {
            this.uri = uri;
        }

        public setParam(key: string, value: string) {
            this.urlParams.push({
                key: key,
                value: value
            });
        }

        public setPostBody(body: any) {
            if (JustDetective.simpleDetect(body)) {
                this.postBody = body;
            }
        }

        public setParamType(paramType: ParamType) {
            this.paramType = paramType;
        }

        public setMethod(method: MethodType) {
            this.method = method;
        }

        public async fetch(key: any = 'http') {
            if (!JustDetective.simpleDetect(this.uri)) {
                return;
            }
            switch (this.method) {
                case MethodType.Get: {
                    const options: any = {};
                    options.method = 'GET';
                    options.uri = this.uri;
                    options.headers = this.headers.get();
                    options.json = true;
                    if (this.urlParams.length > 0) {
                        this.uri = `${this.uri}?`;
                        for (let i = 0; i < this.urlParams.length; i++) {
                            this.uri = `${this.uri}${this.urlParams[0].key}=${this.urlParams[0].value}`;
                        }
                    }
                    try {
                        const result = await rp(options);
                        this.addData({ key: key, value: result });
                    } catch (e) {
                        throw e;
                    }
                    break;
                }
                case MethodType.Post: {
                    const options: any = {};
                    options.method = 'POST';
                    options.uri = this.uri;
                    options.headers = this.headers.get();
                    options.json = true;
                    if (this.urlParams.length > 0) {
                        this.uri = `${this.uri}?`;
                        for (let i = 0; i < this.urlParams.length; i++) {
                            this.uri = `${this.uri}${this.urlParams[0].key}=${this.urlParams[0].value}`;
                        }
                    }
                    switch (this.paramType) {
                        case ParamType.Json: {
                            if (JustDetective.simpleDetect(this.postBody)) {
                                options.body = this.postBody;
                            }
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                    try {
                        const result = await rp(options);
                        this.addData({ key: key, value: result });
                    } catch (e) {
                        throw e;
                    }
                    break;
                }
                case MethodType.Patch: { break; }
                default: {
                    break;
                }
            }
        }
        public async clear() {
            this.clearData();
        }
    }
}
