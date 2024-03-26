/* global  describe, it, expect */
import request from 'supertest';
import HyperExpress from 'hyper-express';
import { HyperExpressServer } from '@src/infra/server/HTTP/adapters/hyper-express/HyperExpressServer';
import { RestAPI } from '@src/infra/RestAPI';
import { InMemoryDbClient } from '@src/infra/persistence/InMemoryDatabase/InMemoryDbClient';
import { infraHandlers } from '@src/infra/server/HTTP/adapters/hyper-express/handlers/infraHandlers';
import { requestHeaderEmployee1 } from '@test/mock';
import { EHTTPFrameworks } from '@src/infra/server/HTTP/ports/EHTTPFrameworks';

describe('hyper-express -> /localhost suite', () => {
  let webServer: HyperExpressServer;
  let API: RestAPI<HyperExpress.Server>;
  beforeAll(async () => {
    webServer = new HyperExpressServer();
    API = new RestAPI<HyperExpress.Server>({
      dbClient: InMemoryDbClient,
      webServer,
      infraHandlers,
      serverType: EHTTPFrameworks.hyper_express
    });

    await API.start();
  });
  afterAll(async () => {
    await API.stop();
  });

  it('localhost should return 200', async () => {
    expect.hasAssertions();

    const response = await fetch('http://localhost:3000/', {
      method: 'GET',
      headers: {
        ...requestHeaderEmployee1
      },
      mode: 'cors',
      cache: 'default'
    });
    const body = await response.json();
    console.log(body);
    // const response = await request(API.server.application)
    //  .get('/')
    //  .set('Accept', 'application/json')
    //  .set(requestHeaderEmployee1);
    expect(response.status).toBe(200);
  });
});
