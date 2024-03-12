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


import transactions from '@seed/transactions';

import { mutexService } from "@src/infra/mutex/adapter/MutexService";

const API = new RestAPI(InMemoryDbClient, mutexService);

describe('get Transactions suite', () => {
    let createdTransaction
    beforeAll(async () => {
        try {
            await API.seedAccounts();
            await API.seedTransactions();
        } catch (error: any) {
            console.log(error.message)
        }
    });

    afterAll(async() => {
        await API.stop();
    });

    it(`Employee1 must be able to read all transactions`, async () => {
        const response = await request(API.server.application)
            .get(`/api/1.0.0/transactions`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set(requestHeaderEmployee1);
        // console.log(response.body);
        expect(response.statusCode).toBe(200);
        
        expect(response.body[0].userEmail).toBe(transactions[0].userEmail);
        expect(response.body[0].amount).toBe(transactions[0].amount);
    });

    it(`employee2 must be able to read all transactions`, async () => {
        const response = await request(API.server.application)
            .get(`/api/1.0.0/transactions`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set(requestHeaderEmployee2);
        // console.log(response.body);
        expect(response.statusCode).toBe(200);
        
        expect(response.body[0].userEmail).toBe(transactions[0].userEmail);
        expect(response.body[0].amount).toBe(transactions[0].amount);
    });


    it(`employee3 must be able to read all transactions`, async () => {
        const response = await request(API.server.application)
            .get(`/api/1.0.0/transactions`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set(requestHeaderEmployee3);
        
        expect(response.statusCode).toBe(200);
        
        expect(response.body[0].userEmail).toBe(transactions[0].userEmail);
        expect(response.body[0].amount).toBe(transactions[0].amount);
    });

    it('Employee4 must not be able to read all transactions - Forbidden: view_transaction role required', async() => {
        const response = await request(API.server.application)
            .get(`/api/1.0.0/transactions`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set(requestHeaderEmployee4);
        // console.log(response.body.message)
        expect(response.statusCode).toBe(403);
        expect(response.body.message).toBe('Forbidden - Insufficient permission - user must have the view_transaction role');
    });
    
    it('Guest must not be able to read an transaction data - Unauthorized', async() => {
        const response = await request(API.server.application)
            .get(`/api/1.0.0/transactions`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set(requestHeaderGuest);
        // console.log(response.body)
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('user not found');
    });
});