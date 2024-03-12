export interface IBlockConfig {
    position: number;
    previousHash: string;
    data: string | number;
    mineLevel: number;
}

export interface IBlockConstructor {
    new(blockContent: IBlockConfig): IBlock;
}

export interface IBlock {
    position: number;
    previousHash: string;
    data: string | number;
    timestamp: Date;
    hash: string;
    calculateHash(): string;
    toJson(): void;
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
    addBlock(block: string): IBlock;
    checkIntegrity(): boolean;
    
}