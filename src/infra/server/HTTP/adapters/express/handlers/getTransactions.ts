import { Request, Response } from 'express';

import { IHandlerFactory } from '@src/infra/server/HTTP/adapters/express/ports/IHandlerFactory';
import { IbaseHandler } from "@src/infra/server/HTTP/adapters/express/ports/IbaseHandler";
import basicAuth from '@src/infra/server/HTTP/adapters/express/auth/basicAuth';
import { 
    isUserAccessGranted
} from '@src/infra/server/HTTP/validators';
import { sendErrorResponse } from '@src/infra/server/HTTP/adapters/express/responses/sendErrorResponse';

import { TransactionDataRepository, TransactionService } from '@src/domains/Transactions';
import { IMutexClient } from '@src/domains/ports/mutex/IMutexClient';


const getTransactions = function({ dbClient, endPointConfig, spec, mutexClient }: IHandlerFactory): IbaseHandler {
    
    return {
        path: '/transactions',
        method: 'get',
        securitySchemes: basicAuth,
        handler: function (req: Request, res: Response) {
            (async() => {
                try {
                    isUserAccessGranted(((req as any).profile ?? {}), endPointConfig);
                    const service = TransactionService.create({
                        repos: {
                            'TransactionDataRepository': TransactionDataRepository.compile({ dbClient }),
                        },
                        mutexClient: mutexClient as IMutexClient
                    });
                    const transactions = await service.getAll();
                    res.status(200).json(transactions);
                } catch (error: unknown) {
                    sendErrorResponse(error as Error, res);
                }  
            })();     
        },
    }
}

export default getTransactions;