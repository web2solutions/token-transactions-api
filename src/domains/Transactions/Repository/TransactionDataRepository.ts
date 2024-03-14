import { IStore } from '@src/domains/ports/persistence/IStore';
import { BaseRepo } from '@src/domains/ports/persistence/BaseRepo';
import { IRepoConfig } from '@src/domains/ports/persistence/IRepoConfig';
import { throwIfNotFound } from '@src/domains/validators';
import { ITransaction, Transaction } from '..';

let transactionDataRepository: any;
export class TransactionDataRepository extends BaseRepo<Transaction> {
  public store: IStore<ITransaction>;

  public limit: number;

  // private dbClient: IDbClient;
  private constructor(config: IRepoConfig) {
    super(config);
    const { limit } = config;
    // this.dbClient = dbClient;
    // points to a collection or table
    this.store = this.dbClient.stores.Transaction as IStore<ITransaction>;
    this.limit = limit ?? 30;
  }

  public async create(data: Transaction): Promise<Transaction> {
    try {
      await this.store.create(data.id, data.serialize() as unknown as ITransaction);
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async update(id: string, data: Transaction): Promise<Transaction> {
    await this.store.update(id, data.serialize() as unknown as ITransaction);
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

  public async getOneById(id: string): Promise<Transaction> {
    try {
      const rawTransaction = await this.store.getOneById(id);
      throwIfNotFound(!!rawTransaction);
      return Promise.resolve(
        new Transaction({
          ...(rawTransaction as unknown as ITransaction),
          readOnly: true
        })
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async getAll(page = 1): Promise<Transaction[]> {
    const result = await this.store.getAll(page, this.limit);
    return result as unknown as Transaction[];
  }

  public static compile(config: IRepoConfig): TransactionDataRepository {
    if (transactionDataRepository) return transactionDataRepository;
    transactionDataRepository = new TransactionDataRepository(config);
    return transactionDataRepository;
  }
}
