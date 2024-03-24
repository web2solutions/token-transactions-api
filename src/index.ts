/* eslint-disable quote-props */
import { Express } from 'express';
import { RestAPI } from '@src/infra/RestAPI';
import { InMemoryDbClient } from '@src/infra/persistence/InMemoryDatabase/InMemoryDbClient';
import { mutexService } from '@src/infra/mutex/adapter/MutexService';
import { ExpressServer } from '@src/infra/server/HTTP/adapters/express/ExpressServer';
import localhostGetHandlerFactory from '@src/infra/server/HTTP/adapters/express/handlers/localhost.get';
import apiVersionsGetHandlerFactory from '@src/infra/server/HTTP/adapters/express/handlers/apiversions.get';
import apiDocGetHandlerFactory from '@src/infra/server/HTTP/adapters/express/handlers/apiDocGetHandlerFactory';

const webServer = ExpressServer.compile();

const infraHandlers = {
  'localhostGetHandlerFactory': localhostGetHandlerFactory,
  'apiVersionsGetHandlerFactory': apiVersionsGetHandlerFactory,
  'apiDocGetHandlerFactory': apiDocGetHandlerFactory
};

const API = new RestAPI<Express>({
  dbClient: InMemoryDbClient,
  webServer,
  mutexService,
  infraHandlers
});

// eslint-disable-next-line jest/require-hook
(async () => {
  await API.start();
})();
