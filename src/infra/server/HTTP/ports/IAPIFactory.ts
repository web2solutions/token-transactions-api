import { IDbClient } from '@src/infra/persistence/port/IDbClient';
import { IHTTPServer } from '@src/infra/server/HTTP/ports/IHTTPServer';
import { IMutexClient } from '@src/domains/ports/mutex/IMutexClient';
import { EndPointFactory } from '@src/infra/server/HTTP/ports/EndPointFactory';

export interface IAPIFactory<ServerType> {
  dbClient: IDbClient,
  webServer: IHTTPServer<ServerType>,
  serverType?: string;
  mutexService?: IMutexClient,
  infraHandlers: Record<string, EndPointFactory>
}
