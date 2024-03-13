import { ITransaction } from '@src/domains/Transactions';

export interface ITransactionBlock extends ITransaction {
  balance: number;
}
export interface IBlockConfig {
    position: number;
    previousHash: string;
    data: ITransactionBlock;
    mineLevel: number;
}
export interface IBlock {
    position: number;
    previousHash: string;
    data: ITransactionBlock;
    timestamp: Date;
    hash: string;
    calculateHash(): string;
    toJson(): void;
}

export interface IBlockConstructor {
  new(blockContent: IBlockConfig): IBlock;
}

export interface IBlockChainConfig {
    mineLevel: number;
    genesis: IBlockConfig;
}

export interface IBlockchain {
    chain: IBlock[];
    mineLevel: number;
    position: number;
    getLastBlock(): IBlock;
    addBlock(block: ITransactionBlock): IBlock;
    checkIntegrity(): boolean;
}
