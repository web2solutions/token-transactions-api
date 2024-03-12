/*global  describe, it, expect */
import request from "supertest";

import { 
  requestHeaderEmployee1, 
  requestHeaderEmployee2, 
  requestHeaderEmployee3, 
  requestHeaderEmployee4,
  requestHeaderGuest,
  account1,
  account2,
  account3,
} from '../mock';

import { RestAPI } from "@src/infra/RestAPI";
import { InMemoryDbClient } from "@src/infra/persistence/InMemoryDatabase/InMemoryDbClient";

const API = new RestAPI(InMemoryDbClient);

describe('add Account suite', () => {

  it(`Employee1 must be able to create an account - account data 1`, async() => {
    const { userEmail, balance } = account1;
    const response = await request(API.server.application)
        .post(`/api/1.0.0/accounts`)
        .send({ userEmail, balance })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set(requestHeaderEmployee1);
    // console.log(response.body)
    expect(response.body.userEmail).toBe(account1.userEmail);
    expect(response.statusCode).toBe(201);
  });

  it(`Employee1 must be able to create an account with balance equal 0 - account data 2`, async() => {
    const { userEmail } = account2;
    const response = await request(API.server.application)
        .post(`/api/1.0.0/accounts`)
        .send({ userEmail, balance: 0 })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set(requestHeaderEmployee1);
    // console.log(response.body)
    expect(response.body.userEmail).toBe(account2.userEmail);
    expect(response.statusCode).toBe(201);
  });

  it(`Employee1 must not be able to create a duplicated account - account data 1`, async() => {
    const { userEmail, balance } = account1;
      const response = await request(API.server.application)
        .post(`/api/1.0.0/accounts`)
        .send({ userEmail, balance })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set(requestHeaderEmployee1);
    expect(response.body.message).toBe('Duplicated record - userEmail already in use');
    expect(response.statusCode).toBe(409);
  });

  it(`Employee1 must not be able to create an account with balance less than 0 - account data 1`, async() => {
    const { userEmail } = account3;
    const response = await request(API.server.application)
        .post(`/api/1.0.0/accounts`)
        .send({ userEmail, balance: -1 })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set(requestHeaderEmployee1);
    expect(response.body.message).toBe('Bad Request - balance must be a positive number');
    expect(response.statusCode).toBe(400);
  });

  
    
  it('Employee1 must not be able to place new account with unknown field', async() => {
    const response = await request(API.server.application)
        .post(`/api/1.0.0/accounts`)
        .send({
            invalidFieldName: 50,
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set(requestHeaderEmployee1);
    
    expect(response.body.message).toBe('Bad Request - The property invalidFieldName from input payload does not exist inside the domain.');
    expect(response.statusCode).toBe(400);
  });

  it('Employee1 must not be able to place new account with empty payload', async() => {
    const response = await request(API.server.application)
        .post(`/api/1.0.0/accounts`)
        .send({})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set(requestHeaderEmployee1);

    expect(response.statusCode).toBe(400);
  });

  


  it('Employee2 must not be able to place new account - Forbidden: the role create_account is required', async() => {
    const response = await request(API.server.application)
        .post(`/api/1.0.0/accounts`)
        .send(account1)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set(requestHeaderEmployee2);
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe('Forbidden - Insufficient permission - user must have the create_account role');
  });

  it('Employee3 must not be able to place new account - Forbidden: the role create_account is required', async() => {
    const response = await request(API.server.application)
        .post(`/api/1.0.0/accounts`)
        .send(account1)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set(requestHeaderEmployee3);

    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe('Forbidden - Insufficient permission - user must have the create_account role');
  });

  it('Employee4 must not be able to place new account - Forbidden: the role create_account is required', async() => {
    const response = await request(API.server.application)
        .post(`/api/1.0.0/accounts`)
        .send(account1)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set(requestHeaderEmployee4);
    // console.log(response.body.message)
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe('Forbidden - Insufficient permission - user must have the create_account role');
  });

  it('Guest must not be able to place new account - Unauthorized', async() => {
    const response = await request(API.server.application)
        .post(`/api/1.0.0/accounts`)
        .send(account1)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set(requestHeaderGuest);
    // console.log(response.body)
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('user not found');
  });
});
