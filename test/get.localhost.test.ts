/*global  describe, it, expect */
import request from "supertest";
import { RestAPI } from "@src/infra/RestAPI";
import { requestHeaderEmployee1 } from './mock';
import { InMemoryDbClient } from "@src/infra/persistence/InMemoryDatabase/InMemoryDbClient";

const API = new RestAPI(InMemoryDbClient);

describe('/localhost suite', () => {
  it('localhost should return 200', async() => {
    const response = await request(API.server.application)
      .get('/')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee1);
    expect(response.statusCode).toBe(200);
  });
});
