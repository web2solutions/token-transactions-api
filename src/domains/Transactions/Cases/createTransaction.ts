import { ITransaction, Transaction } from '../';
import { TransactionCreateDTO } from '@src/domains/Transactions/ports/dto/TransactionCreateDTO';
import { BaseRepo } from '@src/domains/ports/persistence/BaseRepo';

export const createTransaction = async (payload: TransactionCreateDTO, repo: BaseRepo<Transaction>): Promise<ITransaction> => {
  let model: Transaction;
  try {
    model = new Transaction(payload);
    const document = await repo.create(model);
    return Promise.resolve(document.serialize());
  } catch (err) {
    return Promise.reject(err)
  }
};
