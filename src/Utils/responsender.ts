import { Response } from 'express';
import { ResponseCode } from 'justtools';
/**
 *
 * @param response
 * @param content
 * @param code
 */
export async function quicksender(response: Response, content: any, code: ResponseCode) {
    response.status(code);
    response.send(content);
}
