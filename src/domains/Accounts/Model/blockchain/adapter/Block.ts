/* eslint-disable no-console */
import SHA256 from 'crypto-js/sha256';

import {
  // IBlockConstructor,
  IBlockConfig,
  IBlock,
  ITransactionBlock
} from '../port/interfaces';

export class Block implements IBlock {
  public position: number;

  public previousHash: string;

  public data: ITransactionBlock;

  public timestamp: Date;

  public hash: string = '';

  private nonce: number = 0;

  constructor(blockContent: IBlockConfig) {
    const {
      position, previousHash, data, mineLevel
    } = blockContent;
    this.position = position;
    this.previousHash = previousHash;
    this.data = data;
    this.timestamp = new Date();
    this.hash = this.calculateHash();
    this.mineBlock(mineLevel);
  }

  public toJson() {
    return {
      position: this.position,
      previousHash: this.previousHash,
      data: this.data,
      timestamp: this.timestamp,
      hash: this.hash
    };
  }

  public calculateHash(): string {
    const payload = this.position
      + this.previousHash
      + JSON.stringify(this.data)
      + this.timestamp
      + this.nonce;
    return SHA256(payload).toString();
  }

  public mineBlock(mineLevel: number): void {
    while (this.hash.substring(0, mineLevel) !== Array(mineLevel + 1).join('0')) {
      this.nonce += 1;
      this.hash = this.calculateHash();
    }
  }
}
