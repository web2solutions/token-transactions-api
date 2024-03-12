import { IAccount } from '@src/domains/Accounts';
import { BaseRepo } from '@src/domains/ports/persistence/BaseRepo';

export const deleteAccountById = async (
  auctionId: string, 
  repo: BaseRepo<IAccount>, 
): Promise<boolean> => {
  try {
    await repo.delete(auctionId);
    return Promise.resolve(true);
  } catch (err) {
    return Promise.reject(err)
  }
};
