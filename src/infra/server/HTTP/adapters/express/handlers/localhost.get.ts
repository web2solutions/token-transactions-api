import { Request, Response } from 'express';
import { IbaseHandler } from '@src/infra/server/HTTP/ports/IbaseHandler';
import basicAuth from '../auth/basicAuth';

const localhostGetHandlerFactory = (): IbaseHandler => {
  return {
    path: '/',
    method: 'get',
    securitySchemes: basicAuth,
    handler(req: Request, res: Response): void {
      res.status(200).json({ status: 'ok' });
    }
  };
};

export default localhostGetHandlerFactory;
