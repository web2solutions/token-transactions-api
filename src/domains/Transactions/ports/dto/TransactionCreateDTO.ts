import { ETransactionType } from '@src/domains/Transactions';

export interface TransactionCreateDTO {
    userEmail: string;
    amount: number;
    type: ETransactionType;
}
