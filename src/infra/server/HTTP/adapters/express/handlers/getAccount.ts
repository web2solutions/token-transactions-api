import { Request, Response } from 'express';

import { IHandlerFactory } from '@src/infra/server/HTTP/adapters/express/ports/IHandlerFactory';
import { IbaseHandler } from "@src/infra/server/HTTP/adapters/express/ports/IbaseHandler";
import basicAuth from '@src/infra/server/HTTP/adapters/express/auth/basicAuth';
import { 
    isUserAccessGranted,
    validateRequestBody,
    validateRequestParams,
} from '@src/infra/server/HTTP/validators';
import { sendErrorResponse } from '@src/infra/server/HTTP/adapters/express/responses/sendErrorResponse';

import { AccountDataRepository, AccountService } from '@src/domains/Accounts';


const getAccount = function({ dbClient, endPointConfig, spec }: IHandlerFactory): IbaseHandler {
    
    return {
        path: '/accounts/{id}',
        method: 'get',
        securitySchemes: basicAuth,
        handler: function (req: Request, res: Response) {
            (async() => {
                try {
                    isUserAccessGranted(((req as any).profile ?? {}), endPointConfig);
                    validateRequestParams(endPointConfig, req.params);
                    
                    const accountId = req.params.id;
                    const service = AccountService.create({
                        repos: {
                            'AccountDataRepository': AccountDataRepository.compile({ dbClient }),
                        }
                    });
                    const account = await service.getOneById(accountId);    
                    const AccountResponseDTO = { ...account };
                    res.status(200).json(AccountResponseDTO);
                } catch (error: unknown) {
                    sendErrorResponse(error as Error, res);
                }  
            })();     
        },
    }
}

export default getAccount;