import { Request, Response } from 'express';
import { OpenAPIV3 } from 'openapi-types';
import { _DOCS_PREFIX_ } from '../../../../../config/constants';
import { IbaseHandler } from '../ports/IbaseHandler';

const apiVersionsGetHandlerFactory = (apiDocs: Map<string, OpenAPIV3.Document>): IbaseHandler => {
  return {
    path: '/versions',
    method: 'get',
    // securitySchemes: basicAuth,
    handler(req: Request, res: Response): void {
      const versions: Record<string, string> = {};
      for (const [version] of apiDocs) {
        versions[version] = `${_DOCS_PREFIX_}/${version}`;
      }
      res.status(200).json({ versions });
    }
  };
};

export default apiVersionsGetHandlerFactory;
