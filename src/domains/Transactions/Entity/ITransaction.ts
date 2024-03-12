// eslint-disable-next-line no-shadow
export enum ETransactionType {
  send = 'send',
  receive = 'receive',
}

export interface ITransaction {
  id: string;
  userEmail: string;
  amount: number;
  type: ETransactionType;
  createdAt: Date;
  updatedAt: Date;
}
