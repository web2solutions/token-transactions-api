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

import accounts from '@seed/accounts';
import {
  requestHeaderEmployee1,
  requestHeaderEmployee2,
  requestHeaderEmployee3,
  requestHeaderEmployee4,
  requestHeaderGuest
} from '@test/mock';

const webServer = new ExpressServer();
const API = new RestAPI<Express>({
  dbClient: InMemoryDbClient,
  webServer,
  infraHandlers
});
const server = API.server.application;

describe('express -> get Accounts suite', () => {
  beforeAll(async () => {
    await API.seedAccounts();
  });
  afterAll(async () => {
    await API.stop();
  });

  it('employee1 must be able to read all accounts', async () => {
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
    expect(response.body[0].balance).toBe(accounts[0].balance);
  });

  it('employee2 must be able to read all accounts', async () => {
    expect.hasAssertions();
    const response = await request(server)
      .get('/api/1.0.0/accounts')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee2);
    // console.log(response.body);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(accounts.length);
    expect(response.body[0].userEmail).toBe(accounts[0].userEmail);
    expect(response.body[0].balance).toBe(accounts[0].balance);
  });

  it('employee3 must be able to read all accounts', async () => {
    expect.hasAssertions();
    const response = await request(server)
      .get('/api/1.0.0/accounts')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee3);
    // console.log(response.body);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(accounts.length);
    expect(response.body[0].userEmail).toBe(accounts[0].userEmail);
    expect(response.body[0].balance).toBe(accounts[0].balance);
  });

  it('employee4 must not be able to read all accounts - Forbidden: view_account role required', async () => {
    expect.hasAssertions();
    const response = await request(server)
      .get('/api/1.0.0/accounts')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee4);
    // console.log(response.body.message)
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe('Forbidden - Insufficient permission - user must have the view_account role');
  });

  it('guest must not be able to read an account data - Unauthorized', async () => {
    expect.hasAssertions();
    const response = await request(server)
      .get('/api/1.0.0/accounts')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderGuest);
    // console.log(response.body)
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('user not found');
  });
});
