/* global  describe, it, expect */
import request from 'supertest';
import { Express } from 'express';
import { ExpressServer } from '@src/infra/server/HTTP/adapters/express/ExpressServer';
import { RestAPI } from '@src/infra/RestAPI';
import { InMemoryDbClient } from '@src/infra/persistence/InMemoryDatabase/InMemoryDbClient';
import { mutexService } from '@src/infra/mutex/adapter/MutexService';
import {
  requestHeaderEmployee1,
  requestHeaderEmployee2,
  requestHeaderEmployee3,
  requestHeaderEmployee4,
  requestHeaderGuest,
  transaction1,
  transaction2,
  transaction3
} from '../../../mock';

const webServer = ExpressServer.compile();
const API = new RestAPI<Express>(InMemoryDbClient, webServer, mutexService);
const server = API.server.application;

describe('add Transaction suite', () => {
  afterAll(async () => {
    await API.stop();
  });

  it('employee1 must be able to create a transaction - transaction data 1', async () => {
    expect.hasAssertions();
    const { userEmail } = transaction1;
    const amount = 7649;
    const type = 'receive';

    const createdAccountResponse = await request(server)
      .post('/api/1.0.0/accounts')
      .send({
        userEmail,
        balance: 0
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee1);
    // console.log(createdAccountResponse.body);
    const createdAccount = createdAccountResponse.body;

    const response = await request(server)
      .post('/api/1.0.0/transactions')
      .send({ userEmail, amount, type })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee1);
    // console.log(response.body)
    expect(response.body.userEmail).toBe(transaction1.userEmail);
    expect(response.statusCode).toBe(201);

    const responseGetAccount = await request(server)
      .get(`/api/1.0.0/accounts/${createdAccount.id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee1);
    // console.log(responseGetAccount.body.chain)
    expect(responseGetAccount.statusCode).toBe(200);
    expect(responseGetAccount.body.chain[1].data.balance).toBe(amount);
    expect(responseGetAccount.body.chain[1].data.amount).toBe(amount);
  });

  it('employee1 must be able to create a transaction with amount equal 0 - transaction data 2', async () => {
    expect.hasAssertions();
    const { userEmail, type } = transaction2;

    await request(server)
      .post('/api/1.0.0/accounts')
      .send({
        userEmail,
        balance: 0
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee1);

    const response = await request(server)
      .post('/api/1.0.0/transactions')
      .send({ userEmail, amount: 0, type })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee1);
    // console.log(response.body)
    expect(response.body.userEmail).toBe(transaction2.userEmail);
    expect(response.statusCode).toBe(201);
  });

  it('employee1 must not be able to create a transaction with amount less than 0 - transaction data 1', async () => {
    expect.hasAssertions();
    const { userEmail, type } = transaction3;
    await request(server)
      .post('/api/1.0.0/accounts')
      .send({
        userEmail,
        balance: 0
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee1);
    const response = await request(server)
      .post('/api/1.0.0/transactions')
      .send({ userEmail, amount: -1, type })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee1);
    // console.log(response.body)
    expect(response.body.message).toBe('Bad Request - amount must be a positive number');
    expect(response.statusCode).toBe(400);
  });

  it('employee1 must not be able to create new transaction with unknown field', async () => {
    expect.hasAssertions();
    const response = await request(server)
      .post('/api/1.0.0/transactions')
      .send({
        invalidFieldName: 50
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee1);

    expect(response.body.message).toBe('Bad Request - The property invalidFieldName from input payload does not exist inside the domain.');
    expect(response.statusCode).toBe(400);
  });

  it('employee1 must not be able to create new transaction with empty payload', async () => {
    expect.hasAssertions();
    const response = await request(server)
      .post('/api/1.0.0/transactions')
      .send({})
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee1);

    expect(response.statusCode).toBe(400);
  });

  it('employee2 must not be able to create new transaction - Forbidden: the role create_transaction is required', async () => {
    expect.hasAssertions();
    const { userEmail, amount, type } = transaction1;
    const response = await request(server)
      .post('/api/1.0.0/transactions')
      .send({ userEmail, amount, type })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee2);
    // console.log(response.statusCode, response.body)
    expect(response.statusCode).toBe(201);
    expect(response.body.userEmail).toBe(userEmail);
    expect(response.body.amount).toBe(amount);
  });

  it('employee3 must not be able to create new transaction - Forbidden: the role create_transaction is required', async () => {
    expect.hasAssertions();
    const { userEmail, amount, type } = transaction2;
    const response = await request(server)
      .post('/api/1.0.0/transactions')
      .send({ userEmail, amount, type })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee3);

    expect(response.statusCode).toBe(201);
    expect(response.body.userEmail).toBe(userEmail);
    expect(response.body.amount).toBe(amount);
  });

  it('employee4 must not be able to create new transaction - Forbidden: the role create_transaction is required', async () => {
    expect.hasAssertions();
    const { userEmail, amount, type } = transaction3;
    const response = await request(server)
      .post('/api/1.0.0/transactions')
      .send({ userEmail, amount, type })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee4);
    expect(response.statusCode).toBe(201);
    expect(response.body.userEmail).toBe(userEmail);
    expect(response.body.amount).toBe(amount);
  });

  it('guest must not be able to create new transaction - Unauthorized', async () => {
    expect.hasAssertions();
    const { userEmail, amount, type } = transaction1;
    const response = await request(server)
      .post('/api/1.0.0/transactions')
      .send({ userEmail, amount, type })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderGuest);
    // console.log(response.body)
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('user not found');
  });
});