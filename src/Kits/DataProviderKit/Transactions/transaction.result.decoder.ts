
export enum TransDecoderType {
    Postgre
}

export class TransResultDecoder {
    public static decode(result: any, type: TransDecoderType) {
        switch (type) {
            case TransDecoderType.Postgre: {
                return result.rows;
            }
        }
    }
}
