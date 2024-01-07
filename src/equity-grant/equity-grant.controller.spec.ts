import { Test, TestingModule } from '@nestjs/testing';
import { EquityGrantController } from './equity-grant.controller';
import { EquityGrantService } from './equity-grant.service';
import {BadRequestException,InternalServerErrorException, NotFoundException} from '@nestjs/common';
import { EquityGrant as EquityGrantModel } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { CreateEquityGrantDto } from './dto/create-equity-grant.dto';
import { UpdateEquityGrantDto } from './dto/update-equity-grant.dto';

describe('EquityGrantsController', () => {
  let controller: EquityGrantController;
  let service: EquityGrantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      controllers: [EquityGrantController],
      providers: [EquityGrantService, PrismaService],
    }).compile();

    controller = module.get<EquityGrantController>(EquityGrantController);
    service = module.get<EquityGrantService>(EquityGrantService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getAllEquityGrants', () => {
    it('should return an array of equity grants', async () => {
      const result: EquityGrantModel[] = [
        {
          id: 1,
          grantType: 'ISO',
          grantDate: new Date('2024-01-07'),
          exerciseDate: new Date('2025-07-07'),
          deadline: new Date('2025-07-07'),
          sharePrice: 13.654,
          totalNumberOfShares: 12000,
          totalNumberOfVestedShares: 2000,
          employeeId: 2,
          companyId: 1,
          createdAt: new Date('2024-01-06T19:41:18.262Z'),
          updatedAt: new Date('2024-01-06T19:45:54.540Z'),
        },
      ];

      jest.spyOn(service, 'getAllEquityGrants').mockResolvedValue(result);

      expect(await controller.getAllEquityGrants()).toBe(result);
    });
    it('should handle errors and return Internal Server Error', async () => {
      jest.spyOn(service, 'getAllEquityGrants').mockImplementation(() => {
        throw new Error('Some error occurred.');
      });

      await expect(controller.getAllEquityGrants()).rejects.toThrow(InternalServerErrorException);
    });


    describe('getEquityGrantById', () => {
      it('should return a single equity grant', async () => {
        const result = {
          id: 1,
          grantType: 'NSO',
          grantDate: new Date('2024-01-07'),
          exerciseDate: new Date('2025-07-07'),
          deadline: new Date('2025-07-07'),
          sharePrice: 10.5,
          totalNumberOfShares: 1000,
          totalNumberOfVestedShares: 200,
          employeeId: 1,
          companyId: 2,
          createdAt: new Date('2024-01-06T19:41:18.262Z'),
          updatedAt: new Date('2024-01-06T19:45:54.540Z'),
        };

        jest.spyOn(service, 'getEquityGrantById').mockResolvedValue(result as EquityGrantModel | null);
  
        expect(await controller.getEquityGrantById('1')).toBe(result);
      });
  
      it('should handle not found and return Not Found', async () => {
        jest.spyOn(service, 'getEquityGrantById').mockImplementation(() => {
          throw new NotFoundException();
        });
      
        await expect(controller.getEquityGrantById('999')).rejects.toThrow(NotFoundException);
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
          totalNumberOfVestedShares:200
        };
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
          createdAt: new Date('2024-01-06T19:41:18.262Z'),
          updatedAt: new Date('2024-01-06T19:45:54.540Z'),
        }
  
        jest.spyOn(service, 'createEquityGrant').mockResolvedValue(expectedResult);
      
        expect(await controller.createEquityGrant(createDto)).toEqual({
          ...expectedResult,
          id: expect.any(Number),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        });
      });

      it('should handle validation errors', async () => {
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
          totalNumberOfVestedShares:200
        };

        jest.spyOn(service, 'createEquityGrant').mockImplementation(() => {
          throw new BadRequestException();
        });
      
        await expect(controller.createEquityGrant(createDto)).rejects.toThrow(BadRequestException);
      });

      it('should handle errors and return Internal Server Error', async () => {
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
          totalNumberOfVestedShares:200
        };

        jest.spyOn(service, 'createEquityGrant').mockImplementation(() => {
          throw new Error('Some error occurred.');
        });
  
        await expect(controller.createEquityGrant(createDto)).rejects.toThrow(InternalServerErrorException);
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
          createdAt: new Date('2024-01-06T19:41:18.262Z'),
          updatedAt: new Date('2024-01-06T19:45:54.540Z'),
        };
        const updatedGrant: EquityGrantModel = {
          ...existingGrant,
          ...updateDto
        };

        jest.spyOn(service, 'updateEquityGrant').mockResolvedValue(updatedGrant);
      
        expect(await controller.updateEquityGrant('1', updateDto)).toEqual(updatedGrant);
      });
      it('should handle not found and return Not Found', async () => {
        const updateDto: UpdateEquityGrantDto = {
          grantType: 'ISO',
          grantDate: new Date('2003-05-07T00:00:00Z'),
          exerciseDate:new Date('2010-03-04T00:00:00Z'),
          deadline:new Date('2024-08-07T00:00:00Z'),
          sharePrice:13.8,
          totalNumberOfShares:2000,
          totalNumberOfVestedShares:543,
        };

        jest.spyOn(service, 'updateEquityGrant').mockImplementation(() => {
          throw new NotFoundException();
        });
      
        await expect(controller.updateEquityGrant('999', updateDto)).rejects.toThrow(NotFoundException);
      });
      it('should handle validation errors', async () => {
        const updateDto: UpdateEquityGrantDto = {
          grantType: 'ISO',
          grantDate: new Date('2003-05-07T00:00:00Z'),
          exerciseDate:new Date('2010-03-04T00:00:00Z'),
          deadline:new Date('2024-08-07T00:00:00Z'),
          sharePrice:13.8,
          totalNumberOfShares:2000,
          totalNumberOfVestedShares:543,
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
          createdAt: new Date('2024-01-06T19:41:18.262Z'),
          updatedAt: new Date('2024-01-06T19:45:54.540Z'),
        };
        const updatedGrant: EquityGrantModel = {
          ...existingGrant,
          ...updateDto
        };

        jest.spyOn(service, 'updateEquityGrant').mockImplementation(() => {
          throw new BadRequestException();
        });
      
        await expect(controller.updateEquityGrant('1',updatedGrant)).rejects.toThrow(BadRequestException);
      });

      it('should handle errors and return Internal Server Error', async () => {
        const updateDto: UpdateEquityGrantDto = {
          grantType: 'ISO',
          grantDate: new Date('2003-05-07T00:00:00Z'),
          exerciseDate:new Date('2010-03-04T00:00:00Z'),
          deadline:new Date('2024-08-07T00:00:00Z'),
          sharePrice:13.8,
          totalNumberOfShares:2000,
          totalNumberOfVestedShares:543,
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
          createdAt: new Date('2024-01-06T19:41:18.262Z'),
          updatedAt: new Date('2024-01-06T19:45:54.540Z'),
        };
        const updatedGrant: EquityGrantModel = {
          ...existingGrant,
          ...updateDto
        };
        jest.spyOn(service, 'updateEquityGrant').mockImplementation(() => {
          throw new Error('Some error occurred.');
        });
  
        await expect(controller.updateEquityGrant('1',updatedGrant)).rejects.toThrow(InternalServerErrorException);
      });
    });

    describe('deleteEquityGrant', () => {
      it('should delete an equity grant successfully', async () => {
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
          createdAt: new Date('2024-01-06T19:41:18.262Z'),
          updatedAt: new Date('2024-01-06T19:45:54.540Z'),
        };
        jest.spyOn(service, 'deleteEquityGrant').mockResolvedValue(deletedGrant);

        await expect(controller.deleteEquityGrant('1')).resolves.toEqual(deletedGrant);
      });
      it('should handle not found and return Not Found', async () => {
        jest.spyOn(service, 'deleteEquityGrant').mockImplementation(() => {
          throw new NotFoundException();
        });
      
        await expect(controller.deleteEquityGrant('999')).rejects.toThrow(NotFoundException);
      });
      it('should handle errors and return Internal Server Error', async () => {
        jest.spyOn(service, 'deleteEquityGrant').mockImplementation(() => {
          throw new Error('Some error occurred.');
        });
  
        await expect(controller.deleteEquityGrant('1')).rejects.toThrow(InternalServerErrorException);
      });
    });
  });
});