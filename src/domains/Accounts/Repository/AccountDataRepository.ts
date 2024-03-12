import { IAccount, Account } from '../';
import { BaseRepo } from '@src/domains/ports/persistence/BaseRepo';
import { IRepoConfig } from '@src/domains/ports/persistence/IRepoConfig';
import { throwIfNotFound } from '@src/domains/validators';

let accountDataRepository: any;

export class AccountDataRepository extends BaseRepo<Account> {
  public store;
  public limit: number;
  // private dbClient: IDbClient;
  private constructor(config: IRepoConfig<IAccount>) {
    super(config);
    const { limit } = config;
    //this.dbClient = dbClient;
    // points to a collection or table
    this.store = this.dbClient.stores.Account;
    this.limit = limit ?? 30;
  }

  public async create(data: Account): Promise<Account> {
    try {
      await this.store.create(data.id, data.serialize() as unknown as IAccount);
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async update(id: string, data: Account): Promise<Account> {
    await this.store.update(id, data.serialize() as unknown as IAccount);
    return data;
  }

  public async delete(id: string): Promise<boolean> {
    try {
      const result = await this.store.delete(id);
      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async getOneById(id: string): Promise<Account> {
    try {
      const rawAccount = await this.store.getOneById(id);
      throwIfNotFound(!!rawAccount);
      return Promise.resolve(new Account({ ...rawAccount, readOnly: true }));
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async getByUserEmail(userEmail: string): Promise<Account> {
    try {
      if(!this.store.getByUserEmail) return Promise.reject(new Error('getByUserEmail - not implemented'));
      const rawAccount = await this.store.getByUserEmail(userEmail);
      throwIfNotFound(!!rawAccount);
      return Promise.resolve(new Account({ ...rawAccount, readOnly: true }));
    } catch (error) {
      return Promise.reject(error);
    }
  }

  

  public async getAll(page = 1): Promise<Account[]> {
    const result = await this.store.getAll(page, this.limit);
    return result as unknown as Account[];
  }
  
  public static compile (config: IRepoConfig<IAccount>): AccountDataRepository {
    if(accountDataRepository) return accountDataRepository;
    accountDataRepository = new AccountDataRepository(config)
    return accountDataRepository;
  }
}
