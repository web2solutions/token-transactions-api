/*global  describe, it, expect */
import request from "supertest";

import {
    requestHeaderEmployee1,
    requestHeaderEmployee2,
    requestHeaderEmployee3,
    requestHeaderEmployee4,
    requestHeaderGuest,
} from '../mock';

import {
    RestAPI
} from "@src/infra/RestAPI";
import {
    InMemoryDbClient
} from "@src/infra/persistence/InMemoryDatabase/InMemoryDbClient";

import { Account, AccountDataRepository } from "@src/domains/Accounts";
import accounts from '@seed/accounts';

const API = new RestAPI(InMemoryDbClient);

describe('get Accounts suite', () => {
    let createdAccount
    beforeAll(async () => {
        const repoAccount = AccountDataRepository.compile({ dbClient: InMemoryDbClient });
        for(const seedAccount of accounts) {
            const { userEmail, balance } = seedAccount;
            const account = new Account({ userEmail, balance });
            await repoAccount.create(account);
        }
    });

    it(`Employee1 must be able to read all accounts`, async () => {
        const response = await request(API.server.application)
            .get(`/api/1.0.0/accounts`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set(requestHeaderEmployee1);
        // console.log(response.body);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(accounts.length);
        expect(response.body[0].userEmail).toBe(accounts[0].userEmail);
        expect(response.body[0].balance).toBe(accounts[0].balance);
    });

    it(`employee2 must be able to read all accounts`, async () => {
        const response = await request(API.server.application)
            .get(`/api/1.0.0/accounts`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set(requestHeaderEmployee2);
        // console.log(response.body);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(accounts.length);
        expect(response.body[0].userEmail).toBe(accounts[0].userEmail);
        expect(response.body[0].balance).toBe(accounts[0].balance);
    });


    it(`employee3 must be able to read all accounts`, async () => {
        const response = await request(API.server.application)
            .get(`/api/1.0.0/accounts`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set(requestHeaderEmployee3);
        // console.log(response.body);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(accounts.length);
        expect(response.body[0].userEmail).toBe(accounts[0].userEmail);
        expect(response.body[0].balance).toBe(accounts[0].balance);
    });

    it('Employee4 must not be able to read all accounts - Forbidden: view_account role required', async() => {
        const response = await request(API.server.application)
            .get(`/api/1.0.0/accounts`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set(requestHeaderEmployee4);
        // console.log(response.body.message)
        expect(response.statusCode).toBe(403);
        expect(response.body.message).toBe('Forbidden - Insufficient permission - user must have the view_account role');
    });
    
    it('Guest must not be able to read an account data - Unauthorized', async() => {
        const response = await request(API.server.application)
            .get(`/api/1.0.0/accounts`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set(requestHeaderGuest);
        // console.log(response.body)
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('user not found');
    });
});