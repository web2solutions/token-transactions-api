
import { IServiceConfig, TRepos } from './IServiceConfig';
import { IDbClient } from '@src/infra/persistence/port/IDbClient';


export abstract class BaseService<T, M> {
  // public store: IStore<T>;
  public repos: TRepos;
  constructor(config: IServiceConfig) {
    this.repos = config.repos ?? {};
  }

  public abstract create(data: unknown): Promise<T>;
  public abstract update(id: string, data: T): Promise<T>;
  public abstract delete(id: string): Promise<boolean>;
  public abstract getOneById(id: string): Promise<T>;
  public abstract getAll(page: number):Promise<T[]>;
  
  public getOneByUserEmail?(userEmail: string): Promise<M>;
  public sendTokens?(account: M, data: any): Promise<M>;
  public receiveTokens?(account: M, data: any): Promise<M>;
}
