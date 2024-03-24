import { Request } from 'express';
import { FastifyRequest } from 'fastify';

export type IHTTPRequest = FastifyRequest | Request;
