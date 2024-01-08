import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { seedDatabase } from '../prisma/seed-e2e';

describe('Equity Grant controller (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, ConfigModule.forRoot()],
      providers: [PrismaService, ConfigModule],
    }).compile();
    prisma = moduleFixture.get<PrismaService>(PrismaService);

    app = moduleFixture.createNestApplication();
    await app.init();
    await prisma.cleanAllTables();
    await seedDatabase();
  });

  afterAll(async () => {
    jest.restoreAllMocks();
    await prisma.$disconnect();
  });

  async function getValidEquityGrantId(): Promise<number> {
    const equityGrant = await prisma.equityGrant.findFirst();
    return equityGrant.id;
  }

  async function getValidEmployeeId(): Promise<number> {
    const employee = await prisma.employee.findFirst();
    return employee.id;
  }

  async function getValidCompanyId(): Promise<number> {
    const company = await prisma.company.findFirst();
    return company.id;
  }
  

  it('GET /equity-grant', () => {
    return request(app.getHttpServer())
      .get('/equity-grant')
      .expect(200);
  });

  it('GET /equity-grant/:id', async () => {
    const validId = await getValidEquityGrantId();
    return request(app.getHttpServer())
      .get(`/equity-grant/${validId}`)
      .expect(200);
  });

  it('POST /equity-grant', async () => {
    const validEmployeeId = await getValidEmployeeId();
    const validCompanyId = await getValidCompanyId();
    const newGrantData = {
        employee:{
          employeeId:validEmployeeId
        },
        company:{
          companyId:validCompanyId
        },
        grantType: 'NSO',
        grantDate: new Date('2024-01-07T00:00:00Z'),
        exerciseDate:new Date('2025-07-07T00:00:00Z'),
        deadline:new Date('2025-07-07T00:00:00Z'),
        sharePrice:10.5,
        totalNumberOfShares:1000,
        totalNumberOfVestedShares:200,
        vestingPeriod:4,
    };
    return request(app.getHttpServer())
      .post('/equity-grant')
      .send(newGrantData)
      .expect(201);
  });

  it('PUT /equity-grant/:id', async () => {
    const validId = await getValidEquityGrantId();
    const updateData = {
      grantDate: new Date('2024-01-01').toISOString(),
      exerciseDate: new Date('2025-01-01').toISOString(),
      deadline: new Date('2026-01-01').toISOString(),
      sharePrice: 10.2,
      totalNumberOfShares: 1000,
      totalNumberOfVestedShares: 500,
      vestingPeriod: 4
    }
    return request(app.getHttpServer())
      .put(`/equity-grant/${validId}`)
      .send(updateData)
      .expect(200);
  });

  it('DELETE /equity-grant/:id', async() => {
    const validId = await getValidEquityGrantId();
    return request(app.getHttpServer())
      .delete(`/equity-grant/${validId}`)
      .expect(200);
  });
  
});
