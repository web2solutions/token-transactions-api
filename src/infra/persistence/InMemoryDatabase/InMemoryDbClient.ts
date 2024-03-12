
// import { Account } from '@src/domains/Accounts';
import { IDbClient, IDbStores } from '../port/IDbClient';
import { AccountStoreAPI } from './Stores/AccountStoreAPI';
import { TransactionStoreAPI } from './Stores/TransactionStoreAPI';

export const InMemoryDbClient: IDbClient = ((): IDbClient => {
  const stores: IDbStores = {
    Account: AccountStoreAPI,
    Transaction: TransactionStoreAPI,
  };
  const connect = () => {
    return Promise.resolve();
  };
  const disconnect = () => {
    return Promise.resolve();
  };
  return { stores, connect, disconnect };
})();
