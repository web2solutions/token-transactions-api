import { Account, AccountDataRepository } from '..';

export const sendTokens = async (
  account: Account,
  transaction: any,
  repo: AccountDataRepository
): Promise<Account> => {
  try {
    account.send(transaction);
    const document = await repo.update(account.id, account);
    return Promise.resolve(document);
  } catch (err) {
    return Promise.reject(err);
  }
};
