/* eslint-disable @typescript-eslint/no-explicit-any */
/* global  describe, it, expect */
import request from 'supertest';
import { Express } from 'express';
import { ExpressServer } from '@src/infra/server/HTTP/adapters/express/ExpressServer';
import {
  RestAPI
} from '@src/infra/RestAPI';
import {
  InMemoryDbClient
} from '@src/infra/persistence/InMemoryDatabase/InMemoryDbClient';

import { mutexService } from '@src/infra/mutex/adapter/MutexService';
import {
  requestHeaderEmployee1,
  requestHeaderEmployee2,
  requestHeaderEmployee3,
  requestHeaderEmployee4,
  requestHeaderGuest
} from '../../../mock';

const webServer = ExpressServer.compile();
const API = new RestAPI(InMemoryDbClient, webServer, mutexService);
const server = API.server.application as Express;

describe('get Transactions suite', () => {
  beforeAll(async () => {
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

  it('employee1 must be able to read all transactions', async () => {
    expect.hasAssertions();
    const response = await request(server)
      .get('/api/1.0.0/transactions')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee1);
    // console.log(response.body);
    expect(response.statusCode).toBe(200);

    expect(response.body.length > 0).toBeTruthy();
  });

  it('employee2 must be able to read all transactions', async () => {
    expect.hasAssertions();
    const response = await request(server)
      .get('/api/1.0.0/transactions')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee2);
    // console.log(response.body);
    expect(response.statusCode).toBe(200);

    expect(response.body.length > 0).toBeTruthy();
  });

  it('employee3 must be able to read all transactions', async () => {
    expect.hasAssertions();
    const response = await request(server)
      .get('/api/1.0.0/transactions')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee3);

    expect(response.statusCode).toBe(200);

    expect(response.body.length > 0).toBeTruthy();
  });

  it('employee4 must not be able to read all transactions - Forbidden: view_transaction role required', async () => {
    expect.hasAssertions();
    const response = await request(server)
      .get('/api/1.0.0/transactions')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee4);
    // console.log(response.body.message)
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe('Forbidden - Insufficient permission - user must have the view_transaction role');
  });

  it('guest must not be able to read an transaction data - Unauthorized', async () => {
    expect.hasAssertions();
    const response = await request(server)
      .get('/api/1.0.0/transactions')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderGuest);
    // console.log(response.body)
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('user not found');
  });
});
