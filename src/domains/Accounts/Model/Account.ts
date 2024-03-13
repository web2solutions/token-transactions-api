/* eslint-disable no-underscore-dangle */
import { BaseModel } from '@src/domains/ports/persistence/BaseModel';
import { IAccount } from '..';
import {
  canNotBeEmpty, mustBeNumeric, mustBePositiveNumber, canNotWriteDirectly
} from '../../validators';
import { IBlock } from './blockchain/port/interfaces';
import { Blockchain, genesisBlock } from './blockchain/adapter/BlockChain';
import { _MINE_LEVEL_ } from './blockchain/constants';

export class Account extends BaseModel<IAccount> implements IAccount {
  private _userEmail: string = '';

  private _balance: number = 0;

  private _readOnly: boolean = false;
  // private _excludeOnSerialize: string[] = ['send', 'receive'];

  private _blockChain: Blockchain;

  constructor({
    userEmail, id, readOnly, balance, chain
  }: {
    userEmail: string,
    id?: string,
    balance?: number,
    readOnly?: boolean,
    chain?: IBlock[],
  }) {
    super(id);
    this.userEmail = userEmail;
    this._readOnly = readOnly ?? false;
    if (typeof balance !== 'undefined') {
      mustBeNumeric('balance', balance);
      mustBePositiveNumber('balance', balance);
    }
    this._balance = balance ?? 0;
    this._excludeOnSerialize = ['send', 'receive'];

    this._blockChain = new Blockchain({
      mineLevel: _MINE_LEVEL_,
      genesis: genesisBlock(this.userEmail)
    });

    if (chain) {
      this._blockChain.reBuild(chain);
    }
  }

  public get chain(): IBlock[] {
    return [...this._blockChain.chain];
  }

  public get userEmail(): string {
    return this._userEmail;
  }

  public set userEmail(userEmail: string) {
    if (this._readOnly) return;
    canNotBeEmpty('userEmail', userEmail);
    this._userEmail = userEmail;
  }

  public get balance(): number {
    return this._balance;
  }

  // eslint-disable-next-line class-methods-use-this
  public set balance(balance: number) {
    canNotWriteDirectly('balance');
  }

  public send(transaction: any): void {
    const amount = transaction.amount as number;
    mustBeNumeric('amount', amount);
    mustBePositiveNumber('amount', amount);
    mustBePositiveNumber(`'The amount to send can not be greater than balance - Balance: ${this.balance} - Amount: ${amount}`, this.balance - amount);
    this._balance = this.balance - amount;
    this._blockChain.addTransactionBlock(transaction);
  }

  public receive(transaction: any): void {
    const amount = transaction.amount as number;
    mustBeNumeric('amount', amount);
    mustBePositiveNumber('amount', amount);
    this._balance = this.balance + amount;
    this._blockChain.addTransactionBlock(transaction);
  }
}
