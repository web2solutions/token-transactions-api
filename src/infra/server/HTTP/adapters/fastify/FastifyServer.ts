import fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import fastifyStatic from '@fastify/static';
import formBody from '@fastify/formbody';
import path from 'node:path';
import { IbaseHandler } from '@src/infra/server/HTTP/ports/IbaseHandler';
import { HTTPBaseServer } from '@src/infra/server/HTTP/ports/HTTPBaseServer';

const fastifyApp = fastify();
export type Fastify = typeof fastifyApp;

class FastifyServer extends HTTPBaseServer<Fastify> {
  private _application: Fastify;

  constructor() {
    super();
    this._application = fastifyApp;
    this._application.register(cors, {});
    this._application.register(helmet);
    this._application.register(formBody);
    // this._application.use(bodyParser.json({ limit: '100mb' }));
    // this._application.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

    this._application.register(fastifyStatic, {
      root: path.join(__dirname, 'doc')
    });
  }

  get application(): Fastify {
    return this._application;
  }

  public endPointRegister(handlerFactory: IbaseHandler): void {
    try {
      if (handlerFactory.securitySchemes) {
        (this._application as any)[handlerFactory.method](
          handlerFactory.path,
          // handlerFactory.securitySchemes,
          { preHandler: [handlerFactory.securitySchemes] },
          handlerFactory.handler
        );
        return;
      }
      (this._application as any)[handlerFactory.method](
        handlerFactory.path,
        handlerFactory.handler
      );
    } catch (error) {
      // console.log(error);
    }
  }

  public async start(): Promise<void> {
    try {
      await this._application.listen({ port: 3000 });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`An error occurred: ${JSON.stringify(error)}`);
      this.stop(1);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  public stop(code: number = 0) {
    process.exit(code);
  }
}

export { FastifyServer };
