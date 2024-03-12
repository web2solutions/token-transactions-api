import { Transaction } from '@src/domains/Transactions';
import { BaseRepo } from '@src/domains/ports/persistence/BaseRepo';

export const deleteTransactionById = async (
  auctionId: string,
  repo: BaseRepo<Transaction>
): Promise<boolean> => {
  try {
    await repo.delete(auctionId);
    return Promise.resolve(true);
  } catch (err) {
    return Promise.reject(err);
  }
};
