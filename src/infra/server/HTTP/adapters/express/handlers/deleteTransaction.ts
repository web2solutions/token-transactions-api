import { Request, Response } from 'express';

import { IHandlerFactory } from '@src/infra/server/HTTP/adapters/express/ports/IHandlerFactory';
import { IbaseHandler } from "@src/infra/server/HTTP/adapters/express/ports/IbaseHandler";
import basicAuth from '@src/infra/server/HTTP/adapters/express/auth/basicAuth';
import { 
    isUserAccessGranted,
    validateRequestParams,
} from '@src/infra/server/HTTP/validators';
import { sendErrorResponse } from '@src/infra/server/HTTP/adapters/express/responses/sendErrorResponse';

import { TransactionDataRepository, TransactionService } from '@src/domains/Transactions';
import { AccountDataRepository, AccountService } from '@src/domains/Accounts';

import { IMutexClient } from '@src/domains/ports/mutex/IMutexClient';



const deleteTransaction = function({ dbClient, endPointConfig, spec, mutexClient }: IHandlerFactory): IbaseHandler {
    
    return {
        path: '/transactions/{id}',
        method: 'delete',
        securitySchemes: basicAuth,
        handler: function (req: Request, res: Response) {
            (async() => {
                try {
                    isUserAccessGranted(((req as any).profile ?? {}), endPointConfig);
                    validateRequestParams(endPointConfig, req.params);
                    
                    const transactionId = req.params.id;                
                    const accountService = AccountService.create({ repos: {
                        'AccountDataRepository': AccountDataRepository.compile({ dbClient }),
                    } })

                    const service = TransactionService.create({
                        repos: {
                            'TransactionDataRepository': TransactionDataRepository.compile({ dbClient }),
                        },
                        services: {
                            'AccountService': accountService,
                        },
                        mutexClient: mutexClient as IMutexClient,
                    });
                    const deleted = await service.delete(transactionId);
                    
                    res.status(200).json({ deleted: !!deleted });
                } catch (error: unknown) {
                    sendErrorResponse(error as Error, res);
                }  
            })();     
        },
    }
}

export default deleteTransaction;