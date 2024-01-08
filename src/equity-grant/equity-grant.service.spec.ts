import { Test, TestingModule } from '@nestjs/testing';
import { EquityGrantService } from './equity-grant.service';
import { EquityGrant as EquityGrantModel } from '@prisma/client';
import { CreateEquityGrantDto } from './dto/create-equity-grant.dto';
import { UpdateEquityGrantDto } from './dto/update-equity-grant.dto';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';

describe('EquityGrantsService', () => {
  let prisma: PrismaService;
  let service: EquityGrantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [EquityGrantService, PrismaService, ConfigModule],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    service = module.get<EquityGrantService>(EquityGrantService);
    await prisma.cleanEquityGrantTable();
    jest.resetAllMocks();
   
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    jest.restoreAllMocks();
    await prisma.$disconnect();
  });

  describe('getAllEquityGrants', () => {
    it('should return an array of equity grants', async () => {
      const result:EquityGrantModel[] = [
        {
          id: 1,
          grantType: 'NSO',
          grantDate: new Date('2024-01-07'),
          exerciseDate: new Date('2025-07-07'),
          deadline: new Date('2025-07-07'),
          sharePrice: 10.5,
          totalNumberOfShares: 1000,
          totalNumberOfVestedShares: 200,
          vestingPeriod:4,
          employeeId: 1,
          companyId: 2,
          createdAt: new Date('2024-01-06T19:41:18.262Z'),
          updatedAt: new Date('2024-01-06T19:45:54.540Z'),
        },
      ];
      
      jest.spyOn(prisma.equityGrant, 'findMany').mockResolvedValue(result);

      expect(await service.getAllEquityGrants()).toStrictEqual(result);
    });
  });

  describe('getEquityGrantById', () => {
    it('should return a single equity grant by ID', async () => {
      const result = {
        id: 1,
        grantType: 'NSO',
        grantDate: new Date('2024-01-07'),
        exerciseDate: new Date('2025-07-07'),
        deadline: new Date('2025-07-07'),
        sharePrice: 10.5,
        totalNumberOfShares: 1000,
        totalNumberOfVestedShares: 200,
        vestingPeriod:4,
        employeeId: 1,
        companyId: 2,
        createdAt: new Date('2024-01-06T19:41:18.262Z'),
        updatedAt: new Date('2024-01-06T19:45:54.540Z'),
      };
      jest.spyOn(prisma.equityGrant, 'findUnique').mockResolvedValue(result as EquityGrantModel | null);

      expect(await service.getEquityGrantById(1)).toMatchObject(result);
    });

    it('should throw NotFoundException for non-existing ID', async () => {
      jest.spyOn(prisma.equityGrant, 'findUnique').mockResolvedValue(null);

      await expect(service.getEquityGrantById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createEquityGrant', () => {
    it('should create an equity grant successfully', async () => {
      const createDto: CreateEquityGrantDto = {
        employee:{
        employeeId:1
        },
        company:{
        companyId:2
        },
        grantType: 'NSO',
        grantDate: new Date('2024-01-07T00:00:00Z'),
        exerciseDate:new Date('2025-07-07T00:00:00Z'),
        deadline:new Date('2025-07-07T00:00:00Z'),
        sharePrice:10.5,
        totalNumberOfShares:1000,
        totalNumberOfVestedShares:200,
        vestingPeriod:4,
        }

      const expectedResult: EquityGrantModel = {
        id: 1,
        employeeId:1,
        companyId:2,
        grantType: 'NSO',
        grantDate: new Date('2024-01-07T00:00:00Z'),
        exerciseDate:new Date('2025-07-07T00:00:00Z'),
        deadline:new Date('2025-07-07T00:00:00Z'),
        sharePrice:10.5,
        totalNumberOfShares:1000,
        totalNumberOfVestedShares:200,
        vestingPeriod:4,
        createdAt: new Date('2024-01-06T19:41:18.262Z'),
        updatedAt: new Date('2024-01-06T19:45:54.540Z'),
        }

      jest.spyOn(prisma.equityGrant, 'create').mockResolvedValue(expectedResult);

      expect(await service.createEquityGrant(createDto)).toEqual({
        ...expectedResult,
        id: expect.any(Number),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }); 
    });
  });

  describe('updateEquityGrant', () => {
    it('should update an equity grant successfully', async () => {
      const updateDto: UpdateEquityGrantDto = {
        grantType: 'ISO',
        grantDate: new Date('2003-05-07T00:00:00Z'),
        exerciseDate:new Date('2010-03-04T00:00:00Z'),
        deadline:new Date('2024-08-07T00:00:00Z'),
        sharePrice:13.8,
        totalNumberOfShares:2000,
        totalNumberOfVestedShares:543,
        vestingPeriod:3.5
      };
      const existingGrant: EquityGrantModel = {
        id: 1,
        employeeId:1,
        companyId:2,
        grantType: 'NSO',
        grantDate: new Date('2024-01-07T00:00:00Z'),
        exerciseDate:new Date('2025-07-07T00:00:00Z'),
        deadline:new Date('2025-07-07T00:00:00Z'),
        sharePrice:10.5,
        totalNumberOfShares:1000,
        totalNumberOfVestedShares:200,
        vestingPeriod:4,
        createdAt: new Date('2024-01-06T19:41:18.262Z'),
        updatedAt: new Date('2024-01-06T19:45:54.540Z'),
      };
      const updatedGrant: EquityGrantModel = {
        ...existingGrant,
        ...updateDto
      };
      
      jest.spyOn(prisma.equityGrant, 'update').mockResolvedValue(updatedGrant);
  
      expect(await service.updateEquityGrant(existingGrant.id, updateDto)).toEqual(updatedGrant);
    });
  
    it('should throw NotFoundException for non-existing ID', async () => {
      const updateDto: UpdateEquityGrantDto = {
        grantType: 'ISO',
        grantDate: new Date('2003-05-07T00:00:00Z'),
        exerciseDate:new Date('2010-03-04T00:00:00Z'),
        deadline:new Date('2024-08-07T00:00:00Z'),
        sharePrice:13.8,
        totalNumberOfShares:2000,
        totalNumberOfVestedShares:543,
        vestingPeriod:4,
      };

      jest.spyOn(prisma.equityGrant, 'update').mockResolvedValue(null);
  
      await expect(service.updateEquityGrant(999, updateDto)).rejects.toThrow(NotFoundException);
    });
  
  });

  describe('deleteEquityGrant', () => {
    it('should delete an equity grant successfully', async () => {
      const grantId = 1;
      const deletedGrant: EquityGrantModel = {
        id: 1,
        employeeId:1,
        companyId:2,
        grantType: 'NSO',
        grantDate: new Date('2024-01-07T00:00:00Z'),
        exerciseDate:new Date('2025-07-07T00:00:00Z'),
        deadline:new Date('2025-07-07T00:00:00Z'),
        sharePrice:10.5,
        totalNumberOfShares:1000,
        totalNumberOfVestedShares:200,
        vestingPeriod:4,
        createdAt: new Date('2024-01-06T19:41:18.262Z'),
        updatedAt: new Date('2024-01-06T19:45:54.540Z'),
      };
  
      jest.spyOn(prisma.equityGrant, 'delete').mockResolvedValue(deletedGrant);
  
      expect(await service.deleteEquityGrant(grantId)).toEqual(deletedGrant);
    });
  
    it('should throw NotFoundException for non-existing ID', async () => {
      jest.spyOn(prisma.equityGrant, 'delete').mockResolvedValue(null);
  
      await expect(service.deleteEquityGrant(999)).rejects.toThrow(NotFoundException);
    });
  });
});
