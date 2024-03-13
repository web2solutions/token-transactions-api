import {
  BaseService
} from '@src/domains/ports/persistence/BaseService';
import {
  IServiceConfig,
  TRepos,
  TServices
} from '@src/domains/ports/persistence/IServiceConfig';

import { IMutexClient } from '@src/domains/ports/mutex/IMutexClient';

import {
  Transaction,
  TransactionDataRepository,
  createTransaction,
  deleteTransactionById,
  getTransactionById,
  getAllTransactions,
  TransactionCreateDTO,
  ETransactionType
} from '..';

interface ITransactionServiceConfig extends IServiceConfig {
  mutexClient: IMutexClient;
}
let transactionService: any;
export class TransactionService <T> extends BaseService <T, Transaction> {
  public repo: TransactionDataRepository;

  public repos: TRepos;

  public services: TServices;

  public mutexClient: IMutexClient | undefined = undefined;

  private constructor(config: ITransactionServiceConfig) {
    super(config);
    const {
      repos,
      services,
      mutexClient
    } = config;
    this.repos = repos ?? {};
    this.services = services ?? {};
    this.repo = this.repos.TransactionDataRepository as TransactionDataRepository;
    this.mutexClient = mutexClient;
  }

  public async create(data: TransactionCreateDTO): Promise <T> {
    let account;
    try {
      if (
        this.services.AccountService.getOneByUserEmail
        && this.services.AccountService.sendTokens
        && this.services.AccountService.receiveTokens
      ) {
        account = await this.services.AccountService.getOneByUserEmail(data.userEmail);
        // lock account;
        if (account) {
          const lockAccountId = await this.mutexClient?.lock('account', account.id);
          // console.log('lockAccountId', lockAccountId)
          if (lockAccountId && lockAccountId.result?.wasAlreadyLocked) {
            throw new Error('account locked');
          }
          const lockAccountUserEmail = await this.mutexClient?.lock('account', account.userEmail);
          if (lockAccountUserEmail && lockAccountUserEmail.result?.wasAlreadyLocked) {
            throw new Error('account locked');
          }
        }

        if (data.type === ETransactionType.send) {
          account = await this.services.AccountService.sendTokens(account, data);
        } else if (data.type === ETransactionType.receive) {
          account = await this.services.AccountService.receiveTokens(account, data);
        }
      }

      const transaction = await createTransaction(data, this.repo);

      if (account) {
        await this.mutexClient?.unlock('account', account.id);
        await this.mutexClient?.unlock('account', account.userEmail);
      }

      return transaction as T;
    } catch (error) {
      // console.log(error)
      if (account) {
        await this.mutexClient?.unlock('account', account.id);
        await this.mutexClient?.unlock('account', account.userEmail);
      }

      return Promise.reject(error);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  public async update(id: string, data: T): Promise <T> {
    return Promise.resolve(data);
  }

  public async delete(id: string): Promise < boolean > {
    let account;
    let transaction;
    try {
      transaction = await getTransactionById(id, this.repo);
      if (
        this.services.AccountService.getOneByUserEmail
        && this.services.AccountService.sendTokens
        && this.services.AccountService.receiveTokens
      ) {
        const lockTransactionId = await this.mutexClient?.lock('transaction', transaction.id);
        // console.log('lockTransactionId', lockTransactionId)
        if (lockTransactionId && lockTransactionId.result?.wasAlreadyLocked) {
          throw new Error('transaction locked');
        }

        account = await this.services.AccountService.getOneByUserEmail(transaction.userEmail);
        // lock account;
        if (account) {
          const lockAccountId = await this.mutexClient?.lock('account', account.id);
          // console.log('lockAccountId', lockAccountId)
          if (lockAccountId && lockAccountId.result?.wasAlreadyLocked) {
            throw new Error('account locked');
          }
          const lockAccountUserEmail = await this.mutexClient?.lock('account', account.userEmail);
          if (lockAccountUserEmail && lockAccountUserEmail.result?.wasAlreadyLocked) {
            throw new Error('account locked');
          }
        }

        if (transaction.type === ETransactionType.send) {
          account = await this.services.AccountService.receiveTokens(account, transaction);
        } else if (transaction.type === ETransactionType.receive) {
          account = await this.services.AccountService.sendTokens(account, transaction);
        }
      }

      const deleted = await deleteTransactionById(id, this.repo);

      await this.mutexClient?.unlock('transaction', transaction.id);

      if (account) {
        await this.mutexClient?.unlock('account', account.id);
        await this.mutexClient?.unlock('account', account.userEmail);
      }

      return deleted;
    } catch (error) {
      // console.log(error)
      if (transaction) await this.mutexClient?.unlock('transaction', transaction.id);

      if (account) {
        await this.mutexClient?.unlock('account', account.id);
        await this.mutexClient?.unlock('account', account.userEmail);
      }

      throw error;
    }
  }

  public async getOneById(id: string): Promise <T> {
    const transaction = await getTransactionById(id, this.repo);
    return transaction as T;
  }

  public async getAll(): Promise < T[] > {
    const transactions = await getAllTransactions(this.repo);
    return transactions as T[];
  }

  public static create(config: ITransactionServiceConfig) {
    if (transactionService) {
      const {
        repos,
        services
      } = config;
      if (repos) transactionService.repos = repos;
      if (services) transactionService.services = services;
      if (transactionService.repos.TransactionDataRepository) {
        transactionService.repo = transactionService.repos.TransactionDataRepository;
      }
      return transactionService;
    }
    transactionService = new TransactionService(config);
    return transactionService;
  }
}
