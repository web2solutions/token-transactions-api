import { IAccount, AccountDataRepository } from '@src/domains/Accounts';
// import { BaseRepo } from '@src/domains/ports/persistence/BaseRepo';

export const getAllAccounts = async (
  repoAccount: AccountDataRepository
): Promise<IAccount[]> => {
  try {
    const accounts = await repoAccount.getAll();
    return Promise.resolve(accounts);
  } catch (err) {
    return Promise.reject(err);
  }
};
