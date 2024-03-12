/* global  describe, it, expect */
import request from 'supertest';
import { RestAPI } from '@src/infra/RestAPI';
import { InMemoryDbClient } from '@src/infra/persistence/InMemoryDatabase/InMemoryDbClient';
import { requestHeaderEmployee1 } from './mock';

const API = new RestAPI(InMemoryDbClient);

describe('/localhost suite', () => {
  it('localhost should return 200', async () => {
    expect.hasAssertions();
    const response = await request(API.server.application)
      .get('/')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee1);
    expect(response.statusCode).toBe(200);
  });
});
