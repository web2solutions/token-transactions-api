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
  requestHeaderEmployee2,
  requestHeaderEmployee3,
  requestHeaderEmployee4,
  requestHeaderGuest,
  account1
} from '@test/mock';

const webServer = new FastifyServer();
const API = new RestAPI<Fastify>({
  dbClient: InMemoryDbClient,
  webServer,
  infraHandlers,
  serverType: 'fastify'
});
const server = API.server.application;

describe('fastify -> getAccountById suite', () => {
  let createdAccount: IAccount;
  beforeAll(async () => {
    await server.ready();
    // create account
    const {
      userEmail,
      balance
    } = account1;
    const response = await request(server.server)
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
  afterAll(async () => {
    await API.stop();
    await server.close();
  });

  it('employee1 must be able to read an account data', async () => {
    expect.hasAssertions();
    const response = await request(server.server)
      .get(`/api/1.0.0/accounts/${createdAccount.id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee1);

    expect(response.statusCode).toBe(200);
    expect(response.body.userEmail).toBe(createdAccount.userEmail);
  });

  it('employee2 must be able to read an account data', async () => {
    expect.hasAssertions();
    const response = await request(server.server)
      .get(`/api/1.0.0/accounts/${createdAccount.id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee2);

    expect(response.statusCode).toBe(200);
    expect(response.body.userEmail).toBe(createdAccount.userEmail);
  });

  it('employee3 must be able to read an account data', async () => {
    expect.hasAssertions();
    const response = await request(server.server)
      .get(`/api/1.0.0/accounts/${createdAccount.id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee3);

    expect(response.statusCode).toBe(200);
    expect(response.body.userEmail).toBe(createdAccount.userEmail);
  });

  it('employee4 must not be able to read an account data - Forbidden: view_account role required', async () => {
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

  it('guest must not be able to read an account data - Unauthorized', async () => {
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
