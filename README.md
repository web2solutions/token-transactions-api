# Token's transactions API

This is an POC of an API for token transactions.

It was built based on a simplistic interpretation of Hexagonal Architecture and the Domain Driven Design philosophy.

It implements concurrency control through a mutex implementation to achieve data consistency between the different domains.

## Motivation

This project was created as an answer to a `home task coding challenge` managed by [Ledn](https://ledn.io/). Please see the original requirements at [README-BACKEND](./README-BACKEND.md)

Rather than delivering some some pieces of code, the idea is to delivery something as closer as possible to a `software product`, something really useful. Following the industries best practices when it comes to software development, product/project quality/management and success, easy maintenance, smaller footprint, easier delivery, security, adaptability and friction less ability to scale.

It follows an 100% agnostic approach totally focused on `architecture principles` rather than `vendor based` solutions.

As a `product`, this project might be used with different deals. For example it could be used as base for another `hiring processes` that ask people to add new features to this pseudo product.

It is being built using TDD techniques since from the scratch. Due the lack of time, actually it just provide test suites for `integration tests`. It actually covers 100% of the end points.

It does not aims to be a production level application, even why this version persists the whole data in memory. Although it is absolutely prepared to power different kind of production services, running in environments such as `Lambdas`, `EC2`, `ECS`, `On Premise` setup, etc.

It can be used as boilerplate to create `monolith DDD`or `microservice` applications.

### Concurrency control

1. `Add Transaction`
    Locks associated account. Account can not be updated / deleted by another concurrent request
2. `Delete Transaction`
    Locks associated account.  Account can not be updated / deleted by another concurrent request

### Project features high level overview

It implements incoming data validation, in the infrastructure level, through custom logic and based in the Open API specification.

It implements basic HTTP auth mechanism with a custom role system. Replaceable with other auth mechanisms. Tied to the API OAS spec.

It implements a HTTP web server port actually using an adapter for Express.js. It is easily replaceable with Fastify, Hyper-Express, etc.

It implements an agnostic data repository port that actually writes/reads data from a In Memory database. It is easily replaceable with Mongoose, Sequelize, etc.

Actually it has 2 Domains:

1. Accounts

```typescript
    interface IAccount {
        id: string;
        userEmail: string;
        balance: number;
        createdAt: Date;
        updatedAt: Date;
    }
```

2. Transactions

```typescript
    interface ITransaction {
        id: string;
        userEmail: string;
        amount: number;
        type: ETransactionType;
        createdAt: Date;
        updatedAt: Date;
    }
```

Transactions represent a change in the balance of an account - a `send` transaction removes tokens from an account and a `receive` transaction adds tokens to an account. \
A transaction can only be associated with one account. An account can be associated with many transactions. 

### Request data workflow through the architecture's components

Request Handler -> Domain Service -> Domain Use Case -> Data Repository -> Data Adapter

### Response data workflow through the architecture's components

Request Handler <- Domain Service <- Domain Use Case <- Data Repository <- Data Adapter

### Main components and their responsibility scope

1.`Request Handlers`

It is the entry point in a request to the service. 

`It is a infrastructure's component.`

It performs params, body, url and access permission validations against the incoming request, using the associated OAS specification for each end point.

It may offers adapters for different outside service interfaces:

- HTTP - Lambdas (AWS, Azure, Google)
- HTTP - Express
- HTTP - Fastify
- HTTP - Hyper-Express
- HTTP - etc
- Events/SQS
- Events/SNS
- Events/etc

2.`Domain Services`

It is the entry point for the application core (domains).

`It is a domain's component.`

May works as aggregation root talking directly to injected domain services (aka domains and subdomains).

It should be the unique option working as communication interface between `infrastructure` and `domain components`.

It has a dbClient adapter and a mutexClient adapter injected on it instance.

It may lock resources to avoid race conditions by using the injected mutexClient.

It knows it internal domain use cases.

It doesn't knows external domain use cases.

## Required stack

- Node.js (20 preferred)
- Typescript
- Jest
- Redis - used to implement mutex (included as Docker image)
- OpenAPI official typings
- yaml - yaml parser
- Express


## Evaluating the application

1. Install the project

```bash
    npm install
```

2. Run Redis (if you don't have already)

```bash
    npm run docker:composeredis
```

### Run the entire test suite

```bash
    npm test
```

### Run the API - 3000 port

```bash
    npm run dev
```

1. Reach the URL http://localhost:3000/doc/ and click in the `Version 1.0.0`. It will open the API documentation.
2. Reach http://localhost:3000/docs/1.0.0 to see the JSON version of the API documentation.


## Technical Debits

1 . Turn on following lint rules and fix the code:

```javascript
      'no-underscore-dangle': 'off',
      'import/prefer-default-export': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'import/no-cycle' : 'off',
      'arrow-body-style' : 'off',
      'jest/unbound-method': 'off',
```

2. Create a `Dead-Letter` queue for transactions rejected when the resource is locked by the mutex
3. Implement a ServerSentEvent (EventSource) to notify the client about the execution of the items from the `Dead-Leter` queue.
4. Implement dbClient for Mongoose
5. Implement dbClient for Sequelize
6. Implement dbClient from DynamoDB
7. Implement WebServer for Hyper-Express
8. Unit testing - test suite