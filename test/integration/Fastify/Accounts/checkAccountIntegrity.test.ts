/* global  describe, it, expect */
import request from 'supertest';
import { FastifyServer, Fastify } from '@src/infra/server/HTTP/adapters/fastify/FastifyServer';
import { infraHandlers } from '@src/infra/server/HTTP/adapters/express/handlers/infraHandlers';
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
  requestHeaderEmployee4,
  requestHeaderGuest
} from '@test/mock';
import { EHTTPFrameworks } from '@src/infra/server/HTTP/ports/EHTTPFrameworks';

const webServer = new FastifyServer();
const API = new RestAPI<Fastify>({
  dbClient: InMemoryDbClient,
  webServer,
  infraHandlers,
  serverType: EHTTPFrameworks.fastify
});
const server = API.server.application;

describe('fastify -> checkAccountIntegrity suite', () => {
  let createdAccount: IAccount;
  beforeAll(async () => {
    await server.ready();
    // create account
    await API.seedAccounts();
    await API.seedTransactions();
  });
  afterAll(async () => {
    await API.stop();
    await server.close();
  });

  it('account integrity status must be healthy', async () => {
    expect.hasAssertions();
    const { body } = await request(server.server)
      .get('/api/1.0.0/accounts')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee1);
    [createdAccount] = body;

    const response = await request(server.server)
      .get(`/api/1.0.0/accounts/${createdAccount.id}/checkIntegrity`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee1);

    expect(response.statusCode).toBe(200);
    const lastBlock = createdAccount.chain[createdAccount.chain.length - 1];

    expect(createdAccount.balance).toBe(lastBlock.data.balance);
  });

  it('employee4 must not be able to check account integrity - Forbidden: view_account role required', async () => {
    expect.hasAssertions();
    const response = await request(server.server)
      .get(`/api/1.0.0/accounts/${createdAccount.id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee4);
    // console.log(response.body.message)
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe('Forbidden - Insufficient permission - user must have the view_account role');
  });

  it('guest must not be able to check account integrity - Unauthorized', async () => {
    expect.hasAssertions();
    const response = await request(server.server)
      .get(`/api/1.0.0/accounts/${createdAccount.id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderGuest);
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('user not found');
  });
});
