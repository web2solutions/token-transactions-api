import { Request, Response } from 'express';

import { IHandlerFactory } from '@src/infra/server/HTTP/adapters/express/ports/IHandlerFactory';
import { IbaseHandler } from "@src/infra/server/HTTP/adapters/express/ports/IbaseHandler";
import basicAuth from '@src/infra/server/HTTP/adapters/express/auth/basicAuth';
import { 
    isUserAccessGranted,
    validateRequestBody,
} from '@src/infra/server/HTTP/validators';
import { sendErrorResponse } from '@src/infra/server/HTTP/adapters/express/responses/sendErrorResponse';
import transactions from '@seed/transactions';

import { 
    TransactionService,
    TransactionDataRepository, 
    createTransaction, 
    ETransactionType
} from '@src/domains/Transactions';

import { 
    AccountDataRepository,
    AccountService, 
} from '@src/domains/Accounts';
import { IMutexClient } from '@src/domains/ports/mutex/IMutexClient';


const addTransaction = function ({ dbClient, endPointConfig, spec, mutexClient }:  IHandlerFactory): IbaseHandler {
    return {
        path: '/transactions',
        method: 'post',
        securitySchemes: basicAuth,
        handler: function (req: Request, res: Response) {
            (async () => {
                try {
                    isUserAccessGranted(((req as any).profile ?? {}), endPointConfig)
                    validateRequestBody(spec, endPointConfig, req.body);

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
                    const transaction = await service.create(req.body);
                    res.status(201).json(transaction)
                } catch (error: unknown) {


                    // unlock transaction
                    // unlock account;
                    sendErrorResponse(error as Error, res)
                }   
            })();
        },
    }
}

export default addTransaction;