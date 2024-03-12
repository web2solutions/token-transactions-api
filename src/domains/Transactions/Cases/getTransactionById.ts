import { ITransaction, Transaction } from '@src/domains/Transactions';
import { BaseRepo } from '@src/domains/ports/persistence/BaseRepo';

export const getTransactionById = async (
  auctionId: string, 
  repo: BaseRepo<Transaction>, 
): Promise<ITransaction> => {
  try {
    const model = await repo.getOneById(auctionId);
    return Promise.resolve(model.serialize());
  } catch (err) {
    return Promise.reject(err)
  }
};
