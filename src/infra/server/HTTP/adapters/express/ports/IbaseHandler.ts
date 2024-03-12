import { NextFunction, Request, Response } from 'express';

export interface IbaseHandler {
    method: string;
    path: string;
    handler(req: Request, res: Response): void;
    securitySchemes?(req: Request, res: Response, next: NextFunction): void;
}
