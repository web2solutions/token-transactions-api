/* global  describe, it, expect */
import request from 'supertest';

import {
  InMemoryDbClient
} from '@src/infra/persistence/InMemoryDatabase/InMemoryDbClient';
import {
  RestAPI
} from '@src/infra/RestAPI';

import {
  IAccount
} from '@src/domains/Accounts';
import {
  requestHeaderEmployee1,
  requestHeaderEmployee2,
  requestHeaderEmployee3,
  requestHeaderEmployee4,
  requestHeaderGuest,
  account1
} from '../mock';

const API = new RestAPI(InMemoryDbClient);

describe('deleteAccountById suite', () => {
  let createdAccount: IAccount;
  beforeAll(async () => {
    // create account
    const {
      userEmail,
      balance
    } = account1;
    const response = await request(API.server.application)
      .post('/api/1.0.0/accounts')
      .send({
        userEmail,
        balance
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee1);
    createdAccount = response.body;
  });

  it('employee1 must be able to delete account', async () => {
    expect.hasAssertions();
    const response = await request(API.server.application)
      .delete(`/api/1.0.0/accounts/${createdAccount.id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee1);

    expect(response.statusCode).toBe(200);
    expect(response.body.deleted).toBeTruthy();
  });

  it('employee2 must not be able to delete an account - Forbidden: delete_account role required', async () => {
    expect.hasAssertions();
    const response = await request(API.server.application)
      .delete(`/api/1.0.0/accounts/${createdAccount.id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee2);
    // console.log(response.body.message)
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe('Forbidden - Insufficient permission - user must have the delete_account role');
  });

  it('employee3 must not be able to delete an account - Forbidden: delete_account role required', async () => {
    expect.hasAssertions();
    const response = await request(API.server.application)
      .delete(`/api/1.0.0/accounts/${createdAccount.id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee3);
    // console.log(response.body.message)
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe('Forbidden - Insufficient permission - user must have the delete_account role');
  });

  it('employee4 must not be able to delete an account - Forbidden: delete_account role required', async () => {
    expect.hasAssertions();
    const response = await request(API.server.application)
      .delete(`/api/1.0.0/accounts/${createdAccount.id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee4);
    // console.log(response.body.message)
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe('Forbidden - Insufficient permission - user must have the delete_account role');
  });

  it('guest must not be able to delete an account - Unauthorized', async () => {
    expect.hasAssertions();
    const response = await request(API.server.application)
      .delete(`/api/1.0.0/accounts/${createdAccount.id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderGuest);
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('user not found');
  });
});
