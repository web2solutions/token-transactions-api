import { IBlock } from '../Model/blockchain/port/interfaces';

export interface IAccount {
  id: string;
  userEmail: string;
  balance: number;
  chain: IBlock[];
  createdAt: Date;
  updatedAt: Date;
}
