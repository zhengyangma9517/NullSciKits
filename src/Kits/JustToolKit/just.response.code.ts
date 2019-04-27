
export namespace JustResponseCode {
    export enum ResponseCode {
        InternalError = 500,
        BadRequest = 400,
        Unauthorized = 401,
        Forbidden = 403,
        NotFound = 404,
        AlreadyExist = 409,
        TimeExpired = 408,
        OK = 200,
        NoContent = 204
    }
}
