import { Request, Response } from 'express';

import { IHandlerFactory } from '@src/infra/server/HTTP/adapters/express/ports/IHandlerFactory';
import { IbaseHandler } from '@src/infra/server/HTTP/adapters/express/ports/IbaseHandler';
import basicAuth from '@src/infra/server/HTTP/adapters/express/auth/basicAuth';
import {
  isUserAccessGranted
} from '@src/infra/server/HTTP/validators';
import { sendErrorResponse } from '@src/infra/server/HTTP/adapters/express/responses/sendErrorResponse';

import { AccountDataRepository, AccountService } from '@src/domains/Accounts';

const getAccounts = ({ dbClient, endPointConfig }: IHandlerFactory): IbaseHandler => {
  return {
    path: '/accounts',
    method: 'get',
    securitySchemes: basicAuth,
    handler(req: Request, res: Response) {
      (async () => {
        try {
          isUserAccessGranted(((req as any).profile ?? {}), endPointConfig);
          const service = AccountService.compile({
            repos: {
              AccountDataRepository: AccountDataRepository.compile({ dbClient })
            }
          });
          const accounts = await service.getAll();
          res.status(200).json(accounts);
        } catch (error: unknown) {
          sendErrorResponse(error as Error, res);
        }
      })();
    }
  };
};

export default getAccounts;
