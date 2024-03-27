/* global  describe, it, expect */
import request from 'supertest';
import { FastifyServer, Fastify } from '@src/infra/server/HTTP/adapters/fastify/FastifyServer';
import { infraHandlers } from '@src/infra/server/HTTP/adapters/express/handlers/infraHandlers';
import { RestAPI } from '@src/infra/RestAPI';
import { InMemoryDbClient } from '@src/infra/persistence/InMemoryDatabase/InMemoryDbClient';
import {
  requestHeaderEmployee1,
  requestHeaderEmployee2,
  requestHeaderEmployee3,
  requestHeaderEmployee4,
  requestHeaderGuest,
  account1,
  account2,
  account3
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

describe('fastify -> add Account suite', () => {
  beforeAll(async () => {
    await server.ready();
  });
  afterAll(async () => {
    await API.stop();
    await server.close();
  });

  it('employee1 must be able to create an account - account data 1', async () => {
    expect.hasAssertions();
    const { userEmail, balance } = account1;
    const response = await request(server.server)
      .post('/api/1.0.0/accounts')
      .send({ userEmail, balance })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee1);
    // console.log(response.body);
    expect(response.body.userEmail).toBe(account1.userEmail);
    expect(response.body.chain[0].data.balance).toBe(balance);
    expect(response.body.chain[0].data.id).toBe('_genesis_');
    expect(response.statusCode).toBe(201);
  });

  it('employee1 must be able to create an account with balance equal 0 - account data 2', async () => {
    expect.hasAssertions();
    const { userEmail } = account2;
    const response = await request(server.server)
      .post('/api/1.0.0/accounts')
      .send({ userEmail, balance: 0 })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee1);
    // console.log(response.body)
    expect(response.body.userEmail).toBe(account2.userEmail);
    expect(response.body.chain[0].data.balance).toBe(0);
    expect(response.body.chain[0].data.id).toBe('_genesis_');
    expect(response.statusCode).toBe(201);
  });

  it('employee1 must not be able to create a duplicated account - account data 1', async () => {
    expect.hasAssertions();
    const { userEmail, balance } = account1;
    const response = await request(server.server)
      .post('/api/1.0.0/accounts')
      .send({ userEmail, balance })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee1);
    expect(response.body.message).toBe('Duplicated record - userEmail already in use');
    expect(response.statusCode).toBe(409);
  });

  it('employee1 must not be able to create an account with balance less than 0 - account data 1', async () => {
    expect.hasAssertions();
    const { userEmail } = account3;
    const response = await request(server.server)
      .post('/api/1.0.0/accounts')
      .send({ userEmail, balance: -1 })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee1);
    expect(response.body.message).toBe('Bad Request - balance must be a positive number');
    expect(response.statusCode).toBe(400);
  });

  it('employee1 must not be able to place new account with unknown field', async () => {
    expect.hasAssertions();
    const response = await request(server.server)
      .post('/api/1.0.0/accounts')
      .send({
        invalidFieldName: 50
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee1);

    expect(response.body.message).toBe('Bad Request - The property invalidFieldName from input payload does not exist inside the domain.');
    expect(response.statusCode).toBe(400);
  });

  it('employee1 must not be able to place new account with empty payload', async () => {
    expect.hasAssertions();
    const response = await request(server.server)
      .post('/api/1.0.0/accounts')
      .send({})
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee1);

    expect(response.statusCode).toBe(400);
  });

  it('employee2 must not be able to place new account - Forbidden: the role create_account is required', async () => {
    expect.hasAssertions();
    const response = await request(server.server)
      .post('/api/1.0.0/accounts')
      .send(account1)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee2);
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe('Forbidden - Insufficient permission - user must have the create_account role');
  });

  it('employee3 must not be able to place new account - Forbidden: the role create_account is required', async () => {
    expect.hasAssertions();
    const response = await request(server.server)
      .post('/api/1.0.0/accounts')
      .send(account1)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee3);

    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe('Forbidden - Insufficient permission - user must have the create_account role');
  });

  it('employee4 must not be able to place new account - Forbidden: the role create_account is required', async () => {
    expect.hasAssertions();
    const response = await request(server.server)
      .post('/api/1.0.0/accounts')
      .send(account1)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee4);
    // console.log(response.body.message)
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe('Forbidden - Insufficient permission - user must have the create_account role');
  });

  it('guest must not be able to place new account - Unauthorized', async () => {
    expect.hasAssertions();
    const response = await request(server.server)
      .post('/api/1.0.0/accounts')
      .send(account1)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderGuest);
    // console.log(response.body)
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('user not found');
  });
});
