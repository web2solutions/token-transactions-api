import { BaseService } from '@src/domains/ports/persistence/BaseService';
import { IServiceConfig, TRepos } from '@src/domains/ports/persistence/IServiceConfig';
import {
  Account,
  AccountDataRepository,
  createAccount,
  deleteAccountById,
  getAccountById,
  getAllAccounts,
  getAccountByUserEmail,
  sendTokens,
  receiveTokens,
  AccountCreateDTO
} from '..';
import { EIntegrity, IIntegrity } from '../ports/IIntegrity';

interface IAccountServiceConfig extends IServiceConfig {

}
let accountService: any;
export class AccountService<T> extends BaseService<T, Account> {
  private repo: AccountDataRepository;

  public repos: TRepos;

  private constructor(config: IAccountServiceConfig) {
    super(config);
    const { repos } = config;
    this.repos = repos ?? {};
    this.repo = this.repos.AccountDataRepository as AccountDataRepository;
  }

  public async create(data: AccountCreateDTO): Promise<T> {
    const document = await createAccount((data ?? {}), this.repo);
    return document as T;
  }

  // eslint-disable-next-line class-methods-use-this
  public async update(id: string, data: T): Promise<T> {
    return Promise.resolve(data);
  }

  public async delete(id: string): Promise<boolean> {
    /**
     if(account) {
          const lockAccountId = await this.mutexClient?.lock('account', account.id);
          console.log('lockAccountId', lockAccountId)
          if (lockAccountId && lockAccountId.result?.wasAlreadyLocked) {
            throw new Error('account locked');
          }
          const lockAccountUserEmail = await this.mutexClient?.lock('account', account.userEmail);
          if (lockAccountUserEmail && lockAccountUserEmail.result?.wasAlreadyLocked) {
            throw new Error('account locked');
          }
      }
     */
    const deleted = await deleteAccountById(id, this.repo);
    return deleted;
  }

  public async getOneById(id: string): Promise<T> {
    const account = await getAccountById(id, this.repo);
    return account as T;
  }

  public async checkAccountIntegrity(id: string): Promise<IIntegrity> {
    const account = await getAccountById(id, this.repo);

    const lastBlock = account.chain[account.chain.length - 1];
    let status = EIntegrity.healthy;
    if (account.balance !== lastBlock.data.balance) {
      status = EIntegrity.risky;
    }
    return { status };
  }

  public async getOneByUserEmail(userEmail: string): Promise<Account> {
    const account = await getAccountByUserEmail(userEmail, this.repo);
    return account;
  }

  public async sendTokens(account: Account, data: any): Promise<Account> {
    try {
      const updatedAccount = await sendTokens(account, data, this.repo);
      return updatedAccount;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async receiveTokens(account: Account, data: any): Promise<Account> {
    const updatedAccount = await receiveTokens(account, data, this.repo);
    return updatedAccount;
  }

  public async getAll(): Promise<T[]> {
    const accounts = await getAllAccounts(this.repo);
    return accounts as T[];
  }

  public static create(config: IAccountServiceConfig) {
    if (accountService) return accountService;
    accountService = new AccountService(config);
    return accountService;
  }
}
