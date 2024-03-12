import {
  Block
} from './Block';
import {
  _GENESIS_BLOCK_CONFIG_,
  _MINE_LEVEL_
} from './constants';

import {
  IBlock,
  IBlockChainConfig,
  IBlockchain
} from './interfaces';

export class Blockchain implements IBlockchain {
  public chain: IBlock[];

  public position: number = 0;

  public mineLevel: number = 0;

  static instance: IBlockchain;

  constructor(config: IBlockChainConfig) {
    const {
      mineLevel,
      genesis
    } = config;
    this.chain = [new Block(genesis)];
    this.position = 1;
    this.mineLevel = mineLevel;
  }

  getLastBlock(): IBlock {
    return { ...(this.chain[this.chain.length - 1].toJson() as unknown as IBlock) };
  }

  addBlock(data: string): IBlock {
    const { position, mineLevel } = this;
    const previousHash = this.getLastBlock().hash;

    const block = new Block({
      position,
      previousHash,
      data,
      mineLevel
    });

    this.position += 1;
    this.chain.push(block);

    return block;
  }

  checkIntegrity() {
    for (let i = 1; i < this.chain.length; i += 1) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }

  static getInstance(): IBlockchain {
    if (!Blockchain.instance) {
      Blockchain.instance = new Blockchain({
        mineLevel: _MINE_LEVEL_,
        genesis: _GENESIS_BLOCK_CONFIG_
      });
    }
    return Blockchain.instance;
  }
}

export default Blockchain.getInstance();
