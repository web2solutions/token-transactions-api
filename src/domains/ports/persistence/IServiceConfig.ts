import { IAccount, Account } from '@src/domains/Accounts';
import { ITransaction, Transaction } from '@src/domains/Transactions';
import { BaseRepo } from './BaseRepo';
import { BaseService } from './BaseService';
// import { IStore } from './IStore';
export type TRepos = Record<string, BaseRepo<IAccount | ITransaction>>
export type TServices = Record<string, BaseService<IAccount | ITransaction, Account | Transaction>>

export interface IServiceConfig {
  repos?: TRepos;
  services?: TServices;
}
