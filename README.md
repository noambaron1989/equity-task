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

## Noam's comments

This project has been both a challenging and enjoyable experience to build. 
The primary difficulties I encountered were related to setup and test infrastructure. 
However, I'm pleased to report that all tests are now functioning smoothly, and the server is successfully operational.

There are a few known issues that I have yet to address:

* Environment Configuration: Establishing separate environments for testing, development, and production is still pending. This segregation is crucial for effective application management and deployment.

* Prisma Client Instances: The issue of multiple Prisma Client instances needs to be resolved. I'm considering adopting a singleton pattern or implementing global setup procedures to manage this more efficiently, as it's vital for maintaining application performance and stability.

* Test Environment Management: Improving the management of the test environment, particularly in terms of database cleaning and preparation, is necessary. This will ensure test reliability and consistency.

* Business Logic Expansion: There's a need to further develop the business logic layer and integrate these enhancements into the controller routes. This will provide more functionality and flexibility for future requirements.

* Test Segregation: A better distinction between unit tests and integration tests is required to enhance test organization and clarity.

* Database Seeding for Tests: In case of failures with npm run test, consider running ts-node prisma/seed.ts to seed the database beforehand. This step has been incorporated in the end-to-end (e2e) tests but needs to be manually executed for other testing scenarios.


