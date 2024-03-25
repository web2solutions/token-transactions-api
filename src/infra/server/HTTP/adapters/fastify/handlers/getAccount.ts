import xss from 'xss';
import { FastifyRequest, FastifyReply } from 'fastify';
import { EndPointFactory } from '@src/infra/server/HTTP/ports/EndPointFactory';
import { IHandlerFactory } from '@src/infra/server/HTTP/ports/IHandlerFactory';
import { IbaseHandler } from '@src/infra/server/HTTP/ports/IbaseHandler';
import basicAuth from '@src/infra/server/HTTP/adapters/fastify/auth/basicAuth';
import {
  isUserAccessGranted,
  validateRequestParams
} from '@src/infra/server/HTTP/validators';
import { sendErrorResponse } from '@src/infra/server/HTTP/adapters/fastify/responses/sendErrorResponse';

import { AccountDataRepository, AccountService } from '@src/domains/Accounts';

const getAccount: EndPointFactory = (
  { dbClient, endPointConfig }: IHandlerFactory
): IbaseHandler => {
  return {
    path: '/accounts/{id}',
    method: 'get',
    securitySchemes: basicAuth,
    handler(req: FastifyRequest, res: FastifyReply) {
      (async () => {
        try {
          const params = req.params as Record<string, any>;
          isUserAccessGranted(((req as any).profile ?? {}), endPointConfig);
          validateRequestParams(endPointConfig, params);

          const accountId = xss(params.id);
          const service = AccountService.compile({
            repos: {
              AccountDataRepository: AccountDataRepository.compile({ dbClient })
            }
          });
          const account = await service.getOneById(accountId);
          res.code(200).send(account);
        } catch (error: unknown) {
          sendErrorResponse(error as Error, res);
        }
      })();
    }
  };
};

export default getAccount;
