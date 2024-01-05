# Equity Grant Management API

## Objective: 
Develop a CRUD API using Typescript, Node, Prisma, and Jest to manage equity grants for employees.

## Requirements
* Model the needed data structures.
* Implement API endpoints for CRUD operations on equity grants.
  * Use data validation
  * Handle common edge cases
  * support error responses.
* Support common equity management concepts such as:
  * vesting status
  * Vesting schedule
  * Assigning new grants
  * Inital cliff
* Write Jest tests to ensure the functionality of your CRUD operations.


## Before you begin

* Service and project:
  * This is a `nest.js` project.
  * Please create your own service and controller (do not use the default app ones).
  * This projects includes a docker container setup for postgres. Please make sure you have docker setup on your machine.

* Data Modeling:
  * Refer to prisma documentation to manage migrations.
    * e.g. using `npx prisma migrate dev --name <migration_name>`
  * Use `schema.prisma` to manage your models.
  * Implement an `EquityGrant` model linked to the `Employee` model that is already given.
  * You can add any other models that you deem necessary for your project.
  * Notice that we use a seed script, which you can extend.

## Submission
* Clone this repository to your own machine.
* Share your code repository from a public git management website (e.g. github).
* Provide any additional insights or challenges faced during the development process, that you wish us to be aware of.


### Good luck, and happy coding!


## Installation and setup

```bash
$ npm install
$ docker-compose up
$ npx prisma migrate dev
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Seeding
```bash
$ npx prisma db seed
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```