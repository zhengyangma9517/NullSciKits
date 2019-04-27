import { Response } from 'express';
import { JustResponseCode } from '../Kits/JustToolKit/just.tool.kit';
/**
 *
 * @param response
 * @param content
 * @param code
 */
export async function quicksender(response: Response, content: any, code: JustResponseCode.ResponseCode) {
    response.status(code);
    response.send(content);
}
