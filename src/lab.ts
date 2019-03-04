import { HttpDataProvider } from './Kits/DataProviderKit/DataSourceProviders/data.source.provider.remote.http';

async function main() {
    const httpProvider: HttpDataProvider.DataSourceProviderHttp = new HttpDataProvider.DataSourceProviderHttp();
    httpProvider.setUri('http://dev-vend.realjaja.com/api/v1.1/commons/srv/token');
    httpProvider.setParam('srv_sig', 'P7PHfA56M2gW2x62GATp');
    httpProvider.setParamType(HttpDataProvider.ParamType.URLEncode);
    httpProvider.setMethod(HttpDataProvider.MethodType.Get);
    await httpProvider.fetch('test');
    console.log(httpProvider.getDataByKey('test'));
}

main();
