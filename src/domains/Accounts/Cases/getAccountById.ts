import { IAccount, Account } from '@src/domains/Accounts';
import { BaseRepo } from '@src/domains/ports/persistence/BaseRepo';

export const getAccountById = async (
  auctionId: string, 
  repo: BaseRepo<Account>, 
): Promise<IAccount> => {
  try {
    const model = await repo.getOneById(auctionId);
    return Promise.resolve(model.serialize());
  } catch (err) {
    return Promise.reject(err)
  }
};
