import express, { Express } from 'express';
import bodyParser from 'body-parser'
import cors from 'cors';
import { IbaseHandler } from './ports/IbaseHandler';
import { IHTTPServer } from '../../ports/IHTTPServer';

class ExpressServer implements IHTTPServer {
    private _application: Express;
    // private _router: Router = express.Router();
    constructor() {
        this._application =  express();
        this._application.use(cors());
        this._application.use(bodyParser.json({limit: "100mb"}));
        this._application.use(bodyParser.urlencoded({limit:"50mb", extended: true}));
        this._application.use('/doc', express.static('doc'));
    }

    get application (): Express {
        return this._application;
    }

    // get router (): Router {
    //     return this._router;
    // }

    public endPointRegister (handlerFactory: IbaseHandler): void {
        try {
            if(handlerFactory.securitySchemes) {
                (this._application as any)[handlerFactory.method](
                    handlerFactory.path,
                    handlerFactory.securitySchemes, 
                    handlerFactory.handler,
                );
                return;
            }
            (this._application as any)[handlerFactory.method](
                handlerFactory.path, 
                handlerFactory.handler,
            );
        } catch (error) {
            console.log(error);
        }
    }

    public start (): Promise<string | Error> {
        return new Promise((resolve, reject) => {
            try {
                this._application.listen(3000, () => {
                  console.log('Express App Listening on Port 3001');
                  resolve('ok');
                });
            } catch (error) {
                console.error(`An error occurred: ${JSON.stringify(error)}`);
                reject(error as Error);
                this.stop();
            }
        });
    }

    public stop () {
    //     this._application.
        process.exit(0);
    }
}



export { ExpressServer };