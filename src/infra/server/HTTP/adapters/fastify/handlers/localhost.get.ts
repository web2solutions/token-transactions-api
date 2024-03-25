import { FastifyRequest, FastifyReply } from 'fastify';
import { IbaseHandler } from '@src/infra/server/HTTP/ports/IbaseHandler';

const localhostGetHandlerFactory = (): IbaseHandler => {
  return {
    path: '/',
    method: 'get',
    handler(req: FastifyRequest, res: FastifyReply): void {
      res.code(200).send({ status: 'ok' });
    }
  };
};

export default localhostGetHandlerFactory;
