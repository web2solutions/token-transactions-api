/* global  describe, it, expect */
import request from 'supertest';
import { FastifyServer, Fastify } from '@src/infra/server/HTTP/adapters/fastify/FastifyServer';
import { RestAPI } from '@src/infra/RestAPI';
import { InMemoryDbClient } from '@src/infra/persistence/InMemoryDatabase/InMemoryDbClient';
import { requestHeaderEmployee1 } from '@test/mock';

const webServer = FastifyServer.compile();
const API = new RestAPI<Fastify>(InMemoryDbClient, webServer);
const server = API.server.application;

describe('/localhost suite', () => {
  it('localhost should return 200', async () => {
    expect.hasAssertions();
    const response = await request(server.server)
      .get('/')
      .set('Accept', 'application/json')
      .set(requestHeaderEmployee1);
    expect(response.statusCode).toBe(200);
  });
});
