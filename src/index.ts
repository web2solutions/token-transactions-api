import { RestAPI } from '@src/infra/RestAPI';
import { InMemoryDbClient } from '@src/infra/persistence/InMemoryDatabase/InMemoryDbClient';
import { mutexService } from '@src/infra/mutex/adapter/MutexService';
import { ExpressServer } from './infra/server/HTTP/adapters/express/ExpressServer';

const API = new RestAPI(InMemoryDbClient, ExpressServer.compile(), mutexService);

// eslint-disable-next-line jest/require-hook
API.start();
