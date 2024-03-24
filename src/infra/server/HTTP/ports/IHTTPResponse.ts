import { Response } from 'express';
import { FastifyReply } from 'fastify';

export type IHTTPResponse = FastifyReply | Response;
