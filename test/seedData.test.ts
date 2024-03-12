/* eslint-disable @typescript-eslint/no-explicit-any */
/* global  describe, it, expect */
import request from 'supertest';

import {
  RestAPI
} from '@src/infra/RestAPI';
import {
  InMemoryDbClient
} from '@src/infra/persistence/InMemoryDatabase/InMemoryDbClient';

import { mutexService } from '@src/infra/mutex/adapter/MutexService';

import accounts from '@seed/accounts';
import {
  requestHeaderEmployee1
  // requestHeaderEmployee2,
  // requestHeaderEmployee3,
  // requestHeaderEmployee4,
  // requestHeaderGuest,
} from './mock';

const API = new RestAPI(InMemoryDbClient, mutexService);

describe('seed data suite', () => {
  beforeAll(async () => {
    // const accountsMemo: any = {};
    try {
      await API.seedAccounts();
      await API.seedTransactions();
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error.message);
    }
  });

  afterAll(async () => {
    await API.stop();
  });

  it('data must match', async () => {
    expect.hasAssertions();
    const response = await request(API.server.application)
      .get('/api/1.0.0/accounts')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee1);
    // console.log(response.body);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(accounts.length);
    expect(response.body[0].userEmail).toBe(accounts[0].userEmail);
    // expect(response.body[0].amount).toBe(transactions[0].amount);
  });
});
