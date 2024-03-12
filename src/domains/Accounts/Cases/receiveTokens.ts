import { Account, AccountDataRepository } from '..';

export const receiveTokens = async (
  account: Account,
  transaction: any,
  repo: AccountDataRepository
): Promise<Account> => {
  try {
    // const account = await repo.getByUserEmail(userEmail);
    // account = new Account(payload);
    account.receive(transaction);
    // save
    const document = await repo.update(account.id, account);
    return Promise.resolve(document);
  } catch (err) {
    // console.log(err)
    return Promise.reject(err);
  }
};
