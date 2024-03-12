import { IAccount, Account } from '../';
import { AccountCreateDTO } from '@src/domains/Accounts';
import { BaseRepo } from '@src/domains/ports/persistence/BaseRepo';

export const createAccount = async (payload: AccountCreateDTO, repo: BaseRepo<Account>): Promise<IAccount> => {
  let model: Account;
  try {
    model = new Account(payload);
    const document = await repo.create(model);
    return Promise.resolve(document.serialize());
  } catch (err) {
    return Promise.reject(err)
  }
};
