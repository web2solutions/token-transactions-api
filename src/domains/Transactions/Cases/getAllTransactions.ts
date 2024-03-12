import { ITransaction, TransactionDataRepository } from '@src/domains/Transactions';
// import { BaseRepo } from '@src/domains/ports/persistence/BaseRepo';

export const getAllTransactions = async (
  repoTransaction: TransactionDataRepository
): Promise<ITransaction[]> => {
  try {
    const accounts = await repoTransaction.getAll();
    return Promise.resolve(accounts);
  } catch (err) {
    return Promise.reject(err);
  }
};
