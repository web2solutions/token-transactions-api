/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */

import fs from 'fs';
import YAML from 'yaml';
import express from 'express';
import { OpenAPIV3 } from 'openapi-types';

import { IHTTPServer } from '@src/infra/server/HTTP/ports/IHTTPServer';
import { ExpressServer } from '@src/infra/server/HTTP/adapters/express/ExpressServer';
import localhostGetHandlerFactory from '@src/infra/server/HTTP/adapters/express/handlers/localhost.get';
import apiVersionsGetHandlerFactory from '@src/infra/server/HTTP/adapters/express/handlers/apiversions.get';

import { IDbClient } from '@src/infra/persistence/port/IDbClient';
import { IMutexClient } from '@src/infra/mutex/port/IMutexClient';

import { AccountService, AccountDataRepository } from '@src/domains/Accounts';
import { TransactionService, TransactionDataRepository } from '@src/domains/Transactions';

import { replaceVars } from '@src/infra/utils';

import transactions from '@seed/transactions';
import accounts from '@seed/accounts';
import { _DOCS_PREFIX_, _API_PREFIX_ } from './config/constants';

export class RestAPI {
  #_oas: Map<string, OpenAPIV3.Document> = new Map();

  #_started: boolean = false;

  #_server: IHTTPServer;

  #_dbClient: IDbClient;

  #_mutexClient: IMutexClient | undefined;

  constructor(
    dbClient: IDbClient,
    mutexClient?: any
  ) {
    this.#_server = new ExpressServer();

    this.#_dbClient = dbClient;

    if (mutexClient) {
      this.#_mutexClient = mutexClient;
      this.#_mutexClient?.connect();
    }

    this.#_buildWithOAS();

    const localhostGet = localhostGetHandlerFactory();
    this.#_server.endPointRegister(localhostGet);

    // serve API docs as JSON
    const apiVersionsGet = apiVersionsGetHandlerFactory(this.#_oas);
    this.#_server.endPointRegister(apiVersionsGet);

    process.on('exit', () => {
      if (this.#_mutexClient) {
        this.#_mutexClient.disconnect();
      }
    });
  }

  public get dbClient(): IDbClient {
    return this.#_dbClient;
  }

  public get mutexClient(): IMutexClient | undefined {
    return this.#_mutexClient;
  }

  #_buildWithOAS(): void {
    // console.time('Load spec files');
    const specs = fs.readdirSync('./src/infra/spec');
    for (const version of specs) {
      const file = fs.readFileSync(`./src/infra/spec/${version}`, 'utf8');
      const jsonOAS: OpenAPIV3.Document = YAML.parse(file);
      this.#_oas.set(jsonOAS.info.version, jsonOAS);
    }
    this.#_buildDocEndPoints();
    this.#_buildEndPoints();
    // console.timeEnd('Load spec files');
  }

  #_buildEndPoints() {
    for (const [version, spec] of this.#_oas) {
      // console.log([version, spec]);
      const routerVersion = express.Router();
      // console.log(spec.paths);
      for (const path of Object.keys(spec.paths)) {
        const endPointConfigs: Record<string, any> = spec.paths[path] ?? {};
        const methods: string[] = Object.keys(endPointConfigs);
        for (const method of methods) {
          const endPointConfig: Record<string, any> = endPointConfigs[method];

          const authName = Object.keys(endPointConfig.security[0])[0];

          const handlerFactory = require(`@src/infra/server/HTTP/adapters/express/handlers/${endPointConfig.operationId}`).default({
            dbClient: this.#_dbClient,
            mutexClient: this.#_mutexClient,
            endPointConfig,
            spec
          });
          const authMiddleware = require(`@src/infra/server/HTTP/adapters/express/auth/${authName}`).default;
          // console.log(replaceVars(path), method);
          // console.log(endPointConfig.operationId);
          (routerVersion as any)[method](`${replaceVars(path)}`, authMiddleware, handlerFactory.handler);
        }
      }
      this.#_server.application.use(`${_API_PREFIX_}/${version}`, routerVersion);
    }
  }

  #_buildDocEndPoints() {
    const routerDocs = express.Router();
    for (const [version, spec] of this.#_oas) {
      routerDocs.get(`/${version}`, (req, res) => {
        res.json(spec);
      });
    }
    this.#_server.application.use(_DOCS_PREFIX_, routerDocs);
  }

  public get server(): IHTTPServer {
    return this.#_server;
  }

  public async start(): Promise<void> {
    if (this.#_started) return;
    await this.#_dbClient.connect();
    await this.#_server.start();
    this.#_started = true;
  }

  public async stop(): Promise<void> {
    // quit db
    // quit all
    await this.#_dbClient.disconnect();
    await this.#_mutexClient?.disconnect();
    // process.exit(0);
  }

  public async seedData(): Promise<void> {
    await this.seedAccounts();
    await this.seedTransactions();
  }

  public async seedAccounts(): Promise<void> {
    const repo = AccountDataRepository.compile({ dbClient: this.#_dbClient });
    const service = AccountService.create({
      repos: {
        AccountDataRepository: repo
      }
    });
    const requests = [];
    for (const account of accounts) {
      requests.push(new Promise((resolve) => {
        (async () => {
          const { userEmail, balance } = account;
          try {
            await service.create({ userEmail, balance });
          } catch (error: any) {
            // console.log(error.message)
          }
          resolve(true);
        })();
      }));
    }
    await Promise.all(requests);
  }

  public async seedTransactions() {
    const accountRepo = AccountDataRepository.compile({ dbClient: this.#_dbClient });
    const transactionRepo = TransactionDataRepository.compile({ dbClient: this.#_dbClient });

    const accountService = AccountService.create({
      repos: {
        AccountDataRepository: accountRepo
      }
    });
    const transactionService = TransactionService.create({
      repos: {
        TransactionDataRepository: transactionRepo
      },
      services: {
        AccountService: accountService
      },
      mutexClient: this.#_mutexClient as IMutexClient
    });

    const requests = [];
    for (const transaction of transactions) {
      requests.push(new Promise((resolve) => {
        (async () => {
          const { userEmail, amount, type } = transaction;
          try {
            await transactionService.create({
              userEmail,
              amount,
              type
            });
            // console.log(r);
          } catch (error: any) {
            // console.log(error.message)
          }

          resolve(true);
        })();
      }));
    }
    await Promise.all(requests);
  }
}

export default RestAPI;
