import { Express } from 'express';
import { IbaseHandler } from '../adapters/express/ports/IbaseHandler';

type HTTPServerTypes = Express;

export interface IHTTPServer {
    // _application: HTTPServerTypes;
    endPointRegister (handlerFactory: IbaseHandler): void
    application: HTTPServerTypes;
    start(): void;
    stop(): void;
}
