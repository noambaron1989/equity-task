import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { GrantService, QDCriteria } from './grant.service';

describe('GrantService', () => {
    let service: GrantService;
    let prisma: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot()],
            providers: [GrantService, PrismaService],
        }).compile();

        service = module.get<GrantService>(GrantService);
        prisma = module.get<PrismaService>(PrismaService);

        await prisma.cleanEquityGrantTable();
        jest.resetAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
      });
    
      afterAll(async () => {
        jest.restoreAllMocks();
        await prisma.$disconnect();
      });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('calculateEquityPrice', () => {
        it('should correctly calculate the equity price', () => {
          const result = service.calculateEquityPrice(10, 100);
          expect(result).toBe(1000);
        });
    });

    describe('getAllEquityOfEmployee', () => {
        it('should throw an error if the employee does not exist', async () => {
            jest.spyOn(prisma.employee, 'findUnique').mockResolvedValue(null);
          
            await expect(service.getAllEquityOfEmployee(999)).rejects.toThrow('Employee not found');
        });

        it('should return 0 if the employee exists but has no equity grants', async () => {
            const mockEmployee = {
                id: 1,
                equityGrants: []
            };

            jest.spyOn(prisma.employee, 'findUnique').mockResolvedValue(mockEmployee as any);
          
            const totalEquity = await service.getAllEquityOfEmployee(1);
            expect(totalEquity).toBe(0);
        });

        it('should return the total equity of an employee', async () => {
            const mockEmployee = {
                id: 1,
                equityGrants: [
                    { sharePrice: 10, totalNumberOfVestedShares: 100 },
                    { sharePrice: 20, totalNumberOfVestedShares: 50 }
                ]
            };
          
            jest.spyOn(prisma.employee, 'findUnique').mockResolvedValue(mockEmployee as any)
          
            const totalEquity = await service.getAllEquityOfEmployee(1);
            expect(totalEquity).toBe(10 * 100 + 20 * 50);
        });
    });

    describe('getAllEquityOfCompany', () => {
        it('should throw an error if the employee does not exist', async () => {
            jest.spyOn(prisma.company, 'findUnique').mockResolvedValue(null);
          
            await expect(service.getAllEquityOfCompany(999)).rejects.toThrow('Company not found');
        });

        it('should return 0 if the employee exists but has no equity grants', async () => {
            const mockCompany = {
                id: 1,
                equityGrants: []
            };

            jest.spyOn(prisma.company, 'findUnique').mockResolvedValue(mockCompany as any);
          
            const totalEquity = await service.getAllEquityOfCompany(1);
            expect(totalEquity).toBe(0);
        });

        it('should return the total equity of an employee', async () => {
            const mockCompany = {
                id: 1,
                equityGrants: [
                    { sharePrice: 10, totalNumberOfVestedShares: 100 },
                    { sharePrice: 20, totalNumberOfVestedShares: 50 }
                ]
            };
          
            jest.spyOn(prisma.company, 'findUnique').mockResolvedValue(mockCompany as any)
          
            const totalEquity = await service.getAllEquityOfCompany(1);
            expect(totalEquity).toBe(10 * 100 + 20 * 50);
        });
    });

    describe('isEmployeeMeetsQuantifiedDemandCriteria', () => {

        const sharedQdCriteria: QDCriteria = {
            maxSharePrice: 50,
            companyName: 'TechCorp',
            minimumInvestmentAmount: 10000,
            remainingAllocation: 50000
        };
          
        it('should throw an error if the employee does not exist', async () => {
            jest.spyOn(prisma.employee, 'findUnique').mockResolvedValue(null);
          
            await expect(service.isEmployeeMeetsQuantifiedDemandCriteria(sharedQdCriteria, 999)).rejects.toThrow('Employee not found');
        });

        it('should return false if the employee does not meet the QD criteria due to no grants', async () => {
            const mockEmployee = {
              id: 1,
              equityGrants: []
            };
          
            jest.spyOn(prisma.employee, 'findUnique').mockResolvedValue(mockEmployee as any);
          
            const result = await service.isEmployeeMeetsQuantifiedDemandCriteria(sharedQdCriteria, 1);
            expect(result).toBe(false);
        });

        

        it('should return false if the employee does not meet the QD criteria due to share price mismatch', async () => {
            const mockEmployee = {
              id: 1,
              equityGrants: [
                {
                  company: { name: 'TechCorp' },
                  sharePrice: 60,
                  totalNumberOfVestedShares: 100
                }
              ]
            };
          
            jest.spyOn(prisma.employee, 'findUnique').mockResolvedValue(mockEmployee as any);
          
            const result = await service.isEmployeeMeetsQuantifiedDemandCriteria(sharedQdCriteria, 1);
            expect(result).toBe(false);
        });

        it('should return false if the employee does not meet the QD criteria due to company name mismatch', async () => {
            const mockEmployee = {
              id: 1,
              equityGrants: [
                {
                  company: { name: 'TechDorp' },
                  sharePrice: 40,
                  totalNumberOfVestedShares: 100
                }
              ]
            };
          
            jest.spyOn(prisma.employee, 'findUnique').mockResolvedValue(mockEmployee as any);
          
            const result = await service.isEmployeeMeetsQuantifiedDemandCriteria(sharedQdCriteria, 1);
            expect(result).toBe(false);
        });

        it('should return false if the employee does not meet the QD criteria due to funding request below minimumInvestmentAmount', async () => {
            const mockEmployee = {
              id: 1,
              equityGrants: [
                {
                  company: { name: 'TechCorp' },
                  sharePrice: 2,
                  totalNumberOfVestedShares: 1000
                }
              ]
            };
          
            jest.spyOn(prisma.employee, 'findUnique').mockResolvedValue(mockEmployee as any);
          
            const result = await service.isEmployeeMeetsQuantifiedDemandCriteria(sharedQdCriteria, 1);
            expect(result).toBe(false);
        });

        it('should return false if the employee does not meet the QD criteria due to not enough allocation remained', async () => {
            const mockEmployee = {
                id: 1,
                equityGrants: [
                  {
                    company: { name: 'TechCorp' },
                    sharePrice: 60,
                    totalNumberOfVestedShares: 100000
                  }
                ]
            };

            const uniqueQdCriteria: QDCriteria = {
                maxSharePrice: 50,
                companyName: 'TechCorp',
                minimumInvestmentAmount: 10000,
                remainingAllocation: 50
            };
          
            jest.spyOn(prisma.employee, 'findUnique').mockResolvedValue(mockEmployee as any);
          
            const result = await service.isEmployeeMeetsQuantifiedDemandCriteria(uniqueQdCriteria, 1);
            expect(result).toBe(false);
        });

        it('should return true if the employee meets the QD criteria', async () => {
            const mockEmployee = {
              id: 1,
              equityGrants: [
                {
                  company: { name: 'TechCorp' },
                  sharePrice: 40,
                  totalNumberOfVestedShares: 300
                }
              ]
            };
          
            jest.spyOn(prisma.employee, 'findUnique').mockResolvedValue(mockEmployee  as any);
          
            const result = await service.isEmployeeMeetsQuantifiedDemandCriteria(sharedQdCriteria, 1);
            expect(result).toBe(true);
          });
    })



   

});
