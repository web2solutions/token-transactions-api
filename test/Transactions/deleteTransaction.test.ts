/*global  describe, it, expect */
import request from "supertest";

import {
  requestHeaderEmployee1,
  requestHeaderEmployee2,
  requestHeaderEmployee3,
  requestHeaderEmployee4,
  requestHeaderGuest,
  transaction1,
} from '../mock';

import {
  InMemoryDbClient
} from "@src/infra/persistence/InMemoryDatabase/InMemoryDbClient";
import {
  RestAPI
} from "@src/infra/RestAPI";

import {
  ITransaction,
} from "@src/domains/Transactions";

import { mutexService } from "@src/infra/mutex/adapter/MutexService";

const API = new RestAPI(InMemoryDbClient, mutexService);

describe('deleteTransactionById suite', () => {
  let createdTransaction: ITransaction;
  beforeAll(async () => {
    const {
      userEmail,
      amount,
      type,
    } = transaction1;
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
      .send({
        userEmail,
        amount,
        type,
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee1);
    expect(response.statusCode).toBe(201);
    createdTransaction = response.body;

  });
  
  afterAll(async() => {
    await API.stop();
  });

  it('Employee1 must be able to delete transaction', async () => {
    const response = await request(API.server.application)
      .delete(`/api/1.0.0/transactions/${createdTransaction.id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee1);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.deleted).toBeTruthy();
  });

  it('Employee2 must not be able to delete an transaction - Forbidden: delete_transaction role required', async () => {
    const response = await request(API.server.application)
      .delete(`/api/1.0.0/transactions/${createdTransaction.id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee2);
    // console.log(response.body.message)
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe('Forbidden - Insufficient permission - user must have the delete_transaction role');
  });

  it('Employee3 must not be able to delete an transaction - Forbidden: delete_transaction role required', async () => {
    const response = await request(API.server.application)
      .delete(`/api/1.0.0/transactions/${createdTransaction.id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee3);
    // console.log(response.body.message)
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe('Forbidden - Insufficient permission - user must have the delete_transaction role');
  });

  it('Employee4 must not be able to delete an transaction - Forbidden: delete_transaction role required', async () => {
    const response = await request(API.server.application)
      .delete(`/api/1.0.0/transactions/${createdTransaction.id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee4);
    // console.log(response.body.message)
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe('Forbidden - Insufficient permission - user must have the delete_transaction role');
  });

  it('Guest must not be able to delete an transaction - Unauthorized', async () => {
    const response = await request(API.server.application)
      .delete(`/api/1.0.0/transactions/${createdTransaction.id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set(requestHeaderGuest);
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('user not found');
  });

});