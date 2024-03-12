import { RestAPI } from '@src/infra/RestAPI';
import { InMemoryDbClient } from '@src/infra/persistence/InMemoryDatabase/InMemoryDbClient';
import { mutexService } from '@src/infra/mutex/adapter/MutexService';

const API = new RestAPI(InMemoryDbClient, mutexService);

// eslint-disable-next-line jest/require-hook
API.start();
