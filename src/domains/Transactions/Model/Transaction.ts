/* eslint-disable no-underscore-dangle */
import { ITransaction, ETransactionType } from '../';
import { canNotBeEmpty, mustBeNumeric, mustBePositiveNumber } from '../../validators';
import { BaseModel } from '@src/domains/ports/persistence/BaseModel';

export class Transaction extends BaseModel<ITransaction> implements ITransaction {
  private _userEmail: string = '';
  private _amount: number = 0;
  private _readOnly: boolean = false;
  private _type: ETransactionType;
  

  constructor({ userEmail, id, readOnly, amount, type }: { userEmail: string, id?: string, amount?: number, readOnly?: boolean, type: ETransactionType }) {
    super(id);
    this.userEmail = userEmail;
    this._readOnly = readOnly ?? false;
    this.amount = amount ?? 0;
    this._type = type;
  }

  public get userEmail(): string {
    return this._userEmail;
  }

  public set userEmail(userEmail: string) {
    if(this._readOnly) return;
    canNotBeEmpty('userEmail', userEmail);
    this._userEmail = userEmail;
  }

  public get type(): ETransactionType {
    return this._type;
  }

  public get amount(): number {
    return this._amount;
  }

  public set amount(amount: number) {
    if(this._readOnly) return;
    mustBeNumeric('amount', amount);
    mustBePositiveNumber('amount', amount);
    this._amount = amount;
  }
}
