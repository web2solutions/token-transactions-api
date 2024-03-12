
import { Request, Response } from 'express';
import { IbaseHandler } from "../ports/IbaseHandler";
import basicAuth from '../auth/basicAuth';

const localhostGetHandlerFactory = function (): IbaseHandler {
    return {
        path: '/',
        method: "get",
        securitySchemes: basicAuth,
        handler: function (req: Request, res: Response): void {
            res.status(200).json({ status: 'ok' })
        },
    }
}

export default localhostGetHandlerFactory;