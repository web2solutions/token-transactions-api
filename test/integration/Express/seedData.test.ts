/* eslint-disable @typescript-eslint/no-explicit-any */
/* global  describe, it, expect */
import request from 'supertest';
import { Express } from 'express';
import { ExpressServer } from '@src/infra/server/HTTP/adapters/express/ExpressServer';
import { infraHandlers } from '@src/infra/server/HTTP/adapters/express/handlers/infraHandlers';
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
} from '@test/mock';

const webServer = new ExpressServer();
const API = new RestAPI<Express>({
  dbClient: InMemoryDbClient,
  webServer,
  infraHandlers,
  mutexService
});
const server = API.server.application;

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
    const response = await request(server)
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
