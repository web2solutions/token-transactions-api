/* global  describe, it, expect */
import request from 'supertest';

import {
  InMemoryDbClient
} from '@src/infra/persistence/InMemoryDatabase/InMemoryDbClient';
import {
  RestAPI
} from '@src/infra/RestAPI';

import {
  ITransaction
} from '@src/domains/Transactions';

import { mutexService } from '@src/infra/mutex/adapter/MutexService';
import {
  requestHeaderEmployee1,
  requestHeaderEmployee2,
  requestHeaderEmployee3,
  requestHeaderEmployee4,
  requestHeaderGuest,
  transaction1
} from '../mock';

const API = new RestAPI(InMemoryDbClient, mutexService);

describe('getTransactionById suite', () => {
  let createdTransaction: ITransaction;
  beforeAll(async () => {
    const {
      userEmail,
      amount,
      type
    } = transaction1;

    await request(API.server.application)
      .post('/api/1.0.0/accounts')
      .send({
        userEmail,
        balance: 0
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee1);

    const response = await request(API.server.application)
      .post('/api/1.0.0/transactions')
      .send({
        userEmail,
        amount,
        type
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee1);
    createdTransaction = response.body;
  });

  afterAll(async () => {
    await API.stop();
  });

  it('employee1 must be able to read an transaction data', async () => {
    expect.hasAssertions();
    const response = await request(API.server.application)
      .get(`/api/1.0.0/transactions/${createdTransaction.id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee1);

    expect(response.statusCode).toBe(200);
    expect(response.body.userEmail).toBe(createdTransaction.userEmail);
  });

  it('employee2 must be able to read an transaction data', async () => {
    expect.hasAssertions();
    const response = await request(API.server.application)
      .get(`/api/1.0.0/transactions/${createdTransaction.id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee2);

    expect(response.statusCode).toBe(200);
    expect(response.body.userEmail).toBe(createdTransaction.userEmail);
  });

  it('employee3 must be able to read an transaction data', async () => {
    expect.hasAssertions();
    const response = await request(API.server.application)
      .get(`/api/1.0.0/transactions/${createdTransaction.id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee3);

    expect(response.statusCode).toBe(200);
    expect(response.body.userEmail).toBe(createdTransaction.userEmail);
  });

  it('employee4 must not be able to read an transaction data - Forbidden: view_transaction role required', async () => {
    expect.hasAssertions();
    const response = await request(API.server.application)
      .get(`/api/1.0.0/transactions/${createdTransaction.id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee4);
    // console.log(response.body.message)
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe('Forbidden - Insufficient permission - user must have the view_transaction role');
  });

  it('guest must not be able to read an transaction data - Unauthorized', async () => {
    expect.hasAssertions();
    const response = await request(API.server.application)
      .get(`/api/1.0.0/transactions/${createdTransaction.id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderGuest);
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('user not found');
  });
});
