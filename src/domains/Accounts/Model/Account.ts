/* eslint-disable no-underscore-dangle */
import { IAccount } from '../';
import { canNotBeEmpty, mustBeNumeric, mustBePositiveNumber, canNotWriteDirectly } from '../../validators';
import { BaseModel } from '@src/domains/ports/persistence/BaseModel';

export class Account extends BaseModel<IAccount> implements IAccount {
  private _userEmail: string = '';
  private _balance: number = 0;
  private _readOnly: boolean = false;
  // private _excludeOnSerialize: string[] = ['send', 'receive'];
  
  constructor({ userEmail, id, readOnly, balance }: { userEmail: string, id?: string, balance?: number, readOnly?: boolean }) {
    super(id);
    this.userEmail = userEmail;
    this._readOnly = readOnly ?? false;
    if(typeof balance !== 'undefined') {
      mustBeNumeric('balance', balance);
      mustBePositiveNumber('balance', balance);
    }
    this._balance = balance ?? 0
    this._excludeOnSerialize = ['send', 'receive']
  }

  public get userEmail(): string {
    return this._userEmail;
  }

  public set userEmail(userEmail: string) {
    if(this._readOnly) return;
    canNotBeEmpty('userEmail', userEmail);
    this._userEmail = userEmail;
  }

  public get balance(): number {
    return this._balance;
  }

  public set balance(balance: number) {
    canNotWriteDirectly('balance');
  }

  public send(transaction: any): void {
    const amount = transaction.amount as number;
    mustBeNumeric('amount', amount);
    mustBePositiveNumber('amount', amount);
    mustBePositiveNumber(`'The amount to send can not be greater than balance - Balance: ${this.balance} - Amount: ${amount}`, this.balance - amount);
    this._balance = this.balance - amount;
  }
  public receive(transaction: any): void {
    const amount = transaction.amount as number;
    mustBeNumeric('amount', amount);
    mustBePositiveNumber('amount', amount);
    this._balance = this.balance + amount;
  }
}
