import { Request, Response } from 'express';
import { OpenAPIV3 } from 'openapi-types';

import { IbaseHandler } from '@src/infra/server/HTTP/ports/IbaseHandler';
import { sendErrorResponse } from '@src/infra/server/HTTP/adapters/express/responses/sendErrorResponse';

const apiDocGetHandlerFactory = (
  spec: OpenAPIV3.Document,
  version: string
): IbaseHandler => {
  return {
    path: `/${version}`,
    method: 'get',
    handler(req: Request, res: Response) {
      (async () => {
        try {
          res.json(spec);
        } catch (error: unknown) {
          sendErrorResponse(error as Error, res);
        }
      })();
    }
  };
};

export default apiDocGetHandlerFactory;
