export interface IbaseHandlerFactory {
    method: string;
    path: string;
    handler(req: any, res: any): void;
}
