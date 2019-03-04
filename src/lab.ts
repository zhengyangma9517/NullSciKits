import { HttpDataProvider } from './Kits/DataProviderKit/DataSourceProviders/data.source.provider.remote.http';

async function main() {
    const httpProvider: HttpDataProvider.DataSourceProviderHttp = new HttpDataProvider.DataSourceProviderHttp();
    httpProvider.setUri('');
    httpProvider.setHeader('', '');
    // httpProvider.setParamType(HttpDataProvider.ParamType.URLEncode);
    httpProvider.setMethod(HttpDataProvider.MethodType.Get);
    await httpProvider.fetch('test');
    console.log(httpProvider.getDataByKey('test').headers);
}

main();
