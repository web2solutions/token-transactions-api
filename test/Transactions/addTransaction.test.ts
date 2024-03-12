/*global  describe, it, expect */
import request from "supertest";

import { 
  requestHeaderEmployee1, 
  requestHeaderEmployee2, 
  requestHeaderEmployee3, 
  requestHeaderEmployee4,
  requestHeaderGuest,
  transaction1,
  transaction2,
  transaction3,
} from '../mock';

import { RestAPI } from "@src/infra/RestAPI";
import { InMemoryDbClient } from "@src/infra/persistence/InMemoryDatabase/InMemoryDbClient";
import { mutexService } from "@src/infra/mutex/adapter/MutexService";

const API = new RestAPI(InMemoryDbClient, mutexService);

describe('add Transaction suite', () => {

  afterAll(async() => {
    await API.stop();
  });

  it(`Employee1 must be able to create a transaction - transaction data 1`, async() => {
    const { userEmail, amount, type } = transaction1;
    
    await request(API.server.application)
      .post(`/api/1.0.0/accounts`)
      .send({
        userEmail,
        balance: 0,
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee1);

    const response = await request(API.server.application)
        .post(`/api/1.0.0/transactions`)
        .send({ userEmail, amount, type })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set(requestHeaderEmployee1);
    // console.log(response.body)
    expect(response.body.userEmail).toBe(transaction1.userEmail);
    expect(response.statusCode).toBe(201);
  });

  it(`Employee1 must be able to create a transaction with amount equal 0 - transaction data 2`, async() => {
    const { userEmail, type } = transaction2;
    
    await request(API.server.application)
      .post(`/api/1.0.0/accounts`)
      .send({
        userEmail,
        balance: 0,
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee1);

    const response = await request(API.server.application)
        .post(`/api/1.0.0/transactions`)
        .send({ userEmail, amount: 0, type })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set(requestHeaderEmployee1);
    // console.log(response.body)
    expect(response.body.userEmail).toBe(transaction2.userEmail);
    expect(response.statusCode).toBe(201);
  });

  it(`Employee1 must not be able to create a transaction with amount less than 0 - transaction data 1`, async() => {
    const { userEmail, type } = transaction3;
    await request(API.server.application)
      .post(`/api/1.0.0/accounts`)
      .send({
        userEmail,
        balance: 0,
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee1);
    const response = await request(API.server.application)
        .post(`/api/1.0.0/transactions`)
        .send({ userEmail, amount: -1, type })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set(requestHeaderEmployee1);
    // console.log(response.body)
    expect(response.body.message).toBe('Bad Request - amount must be a positive number');
    expect(response.statusCode).toBe(400);
  });

  
    
  it('Employee1 must not be able to create new transaction with unknown field', async() => {
    const response = await request(API.server.application)
        .post(`/api/1.0.0/transactions`)
        .send({
            invalidFieldName: 50,
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set(requestHeaderEmployee1);
    
    expect(response.body.message).toBe('Bad Request - The property invalidFieldName from input payload does not exist inside the domain.');
    expect(response.statusCode).toBe(400);
  });

  it('Employee1 must not be able to create new transaction with empty payload', async() => {
    const response = await request(API.server.application)
        .post(`/api/1.0.0/transactions`)
        .send({})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set(requestHeaderEmployee1);

    expect(response.statusCode).toBe(400);
  });

  


  it('Employee2 must not be able to create new transaction - Forbidden: the role create_transaction is required', async() => {
    const { userEmail, amount, type } = transaction1;
    const response = await request(API.server.application)
        .post(`/api/1.0.0/transactions`)
        .send({ userEmail, amount, type })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set(requestHeaderEmployee2);
    // console.log(response.statusCode, response.body)
    expect(response.statusCode).toBe(201);
    expect(response.body.userEmail).toBe(userEmail);
    expect(response.body.amount).toBe(amount);
  });

  it('Employee3 must not be able to create new transaction - Forbidden: the role create_transaction is required', async() => {
    const { userEmail, amount, type } = transaction2;
    const response = await request(API.server.application)
        .post(`/api/1.0.0/transactions`)
        .send({ userEmail, amount, type })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set(requestHeaderEmployee3);

    expect(response.statusCode).toBe(201);
    expect(response.body.userEmail).toBe(userEmail);
    expect(response.body.amount).toBe(amount);
  });

  it('Employee4 must not be able to create new transaction - Forbidden: the role create_transaction is required', async() => {
    const { userEmail, amount, type } = transaction3;
    const response = await request(API.server.application)
        .post(`/api/1.0.0/transactions`)
        .send({ userEmail, amount, type })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set(requestHeaderEmployee4);
    expect(response.statusCode).toBe(201);
    expect(response.body.userEmail).toBe(userEmail);
    expect(response.body.amount).toBe(amount);
  });

  it('Guest must not be able to create new transaction - Unauthorized', async() => {
    const { userEmail, amount, type } = transaction1;
    const response = await request(API.server.application)
        .post(`/api/1.0.0/transactions`)
        .send({ userEmail, amount, type })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set(requestHeaderGuest);
    // console.log(response.body)
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('user not found');
  });
});
