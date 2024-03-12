import { Account, AccountDataRepository } from '@src/domains/Accounts';
// import { BaseRepo } from '@src/domains/ports/persistence/BaseRepo';

export const getAccountByUserEmail = async (
  userEmail: string,
  repo: AccountDataRepository
): Promise<Account> => {
  try {
    const model = await repo.getByUserEmail(userEmail);
    return Promise.resolve(model);
  } catch (err) {
    return Promise.reject(err);
  }
};
