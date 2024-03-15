/* eslint-disable jest/require-hook, no-console */
import { Transaction, ETransactionType, ITransaction } from '@src/domains/Transactions';

import {
  Block
} from './Block';
import {
  _MINE_LEVEL_
} from '../constants';

import {
  IBlock,
  IBlockChainConfig,
  IBlockchain,
  ITransactionBlock,
  IBlockConfig
} from '../port/interfaces';

export const genesisBlock = (userEmail: string, balance: number): IBlockConfig => {
  return {
    position: 0,
    previousHash: '',
    data: {
      id: '_genesis_',
      userEmail,
      amount: balance,
      type: ETransactionType.receive,
      createdAt: new Date(),
      updatedAt: new Date(),
      balance
    },
    mineLevel: _MINE_LEVEL_
  };
};

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

  addBlock(data: ITransactionBlock): IBlock {
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

  addTransactionBlock(transaction: ITransaction): IBlock {
    const { userEmail, amount, type } = transaction;
    const model = new Transaction({ userEmail, amount, type: (type as ETransactionType) });
    const lastBlock = this.getLastBlock();
    const transactionRawData = model.serialize();
    let { balance } = lastBlock.data;
    if (transactionRawData.type === ETransactionType.receive) {
      balance += transactionRawData.amount;
    } else if (transactionRawData.type === ETransactionType.send) {
      balance -= transactionRawData.amount;
    }

    const block = this.addBlock({
      ...transactionRawData,
      balance
    });

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

  public reBuild(chain: IBlock[]): void {
    this.chain = [];
    this.chain = [...chain];
    this.position += (chain.length - 1);
  }

  static getInstance(): IBlockchain {
    if (!Blockchain.instance) {
      Blockchain.instance = new Blockchain({
        mineLevel: _MINE_LEVEL_,
        genesis: genesisBlock('', 0)
      });
    }
    return Blockchain.instance;
  }
}

/* const account = {
  userEmail: 'Cloyd16@hotmail.com',
  balance: 8669,
  updatedAt: '2019-12-25T18:07:05.231Z'
};

const transactions = [{
  userEmail: 'Cloyd16@hotmail.com',
  amount: 7649,
  type: 'receive',
  createdAt: null
}, {
  userEmail: 'Cloyd16@hotmail.com',
  amount: 3704,
  type: 'receive',
  createdAt: null
}, {
  userEmail: 'Cloyd16@hotmail.com',
  amount: 6031,
  type: 'receive',
  createdAt: null
}, {
  userEmail: 'Cloyd16@hotmail.com',
  amount: 4678,
  type: 'receive',
  createdAt: null
}, {
  userEmail: 'Cloyd16@hotmail.com',
  amount: 2575,
  type: 'receive',
  createdAt: null
}, {
  userEmail: 'Cloyd16@hotmail.com',
  amount: 7116,
  type: 'send',
  createdAt: null
}];

const blockChain = new Blockchain({
  mineLevel: _MINE_LEVEL_,
  genesis: genesisBlock(account.userEmail)
});

for (const data of transactions) {
  const transaction = new Transaction({
    ...data,
    type: data.type as ETransactionType
  });
  blockChain.addTransactionBlock(transaction);
}

console.log(blockChain);

const blockChain2 = new Blockchain({
  mineLevel: _MINE_LEVEL_,
  genesis: genesisBlock(account.userEmail)
});

blockChain2.reBuild(blockChain.chain as Block[]);

console.log(blockChain2); */
