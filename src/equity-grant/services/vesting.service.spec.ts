import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { VestingService, VestingStatus } from './vesting.service';
import { EquityGrant } from '@prisma/client';
import { ConfigModule } from '@nestjs/config';

describe('VestingService', () => {
    let service: VestingService;
    let prisma: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot()],
            providers: [VestingService, PrismaService],
        }).compile();

        service = module.get<VestingService>(VestingService);
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

    describe('calculateVestingSchedule', () => {
        it('should calculate the correct vesting schedule', () => {
            const grant: EquityGrant = {
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

            const schedule = service.calculateVestingSchedule(grant);
            expect(schedule).toBeDefined();
    
            const monthsToVest = grant.vestingPeriod * 12; // 4 years * 12 months
            const vestedSharesPerMonth = grant.totalNumberOfShares / monthsToVest;

            for (let month = 1; month <= monthsToVest; month++) {
                const expectedVestedShares = vestedSharesPerMonth * month;
                expect(schedule[`month${month}`]).toBe(expectedVestedShares);
            }
        });

        describe('getVestingStatus', () => {
            it('should return "Pending" for grants with a future start date', () => {
                const futureDate = new Date();
                futureDate.setDate(futureDate.getDate() + 10); // 10 days into the future
                const grant: EquityGrant = {
                    id: 1,
                    grantDate: futureDate,
                    grantType: 'NSO',
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
              
                const status = service.getVestingStatus(grant);
                expect(status).toBe(VestingStatus.PENDING);
            });

            it('should return "In Progress" for grants currently vesting', () => {
                const pastDate = new Date();
                pastDate.setFullYear(pastDate.getFullYear() - 2); // 2 years in the past
                const grant: EquityGrant = {
                    id: 1,
                    grantDate: pastDate,
                    grantType: 'NSO',
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
              
                const status = service.getVestingStatus(grant);
                expect(status).toBe(VestingStatus.IN_PROGRESS);
            });

            it('should return "Vested" for grants that have fully vested', () => {
                const pastDate = new Date();
                pastDate.setFullYear(pastDate.getFullYear() - 5); // 5 years in the past
                const grant: EquityGrant = {
                    id: 1,
                    grantDate: pastDate,
                    grantType: 'NSO',
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
              
                const status = service.getVestingStatus(grant);
                expect(status).toBe(VestingStatus.VESTED);
              });              
        });

        describe('calculateVestingSchedule', () => {
            it('should return the total number of vested shares for an existing employee with vested grants', async () => {
                const mockEmployee = {
                  id: 1,
                  equityGrants: [
                    { totalNumberOfVestedShares: 100 },
                    { totalNumberOfVestedShares: 200 }
                  ]
                };
              
                jest.spyOn(prisma.employee, 'findUnique').mockResolvedValue(mockEmployee as any);
              
                const totalVested = await service.getAllVestedOptionsOfEmployee(1);
                expect(totalVested).toBe(300);
            });

            it('should return 0 for an existing employee with no vested grants', async () => {
                const mockEmployee = {
                  id: 1,
                  equityGrants: []
                };
              
                jest.spyOn(prisma.employee, 'findUnique').mockResolvedValue(mockEmployee as any);
              
                const totalVested = await service.getAllVestedOptionsOfEmployee(1);
                expect(totalVested).toBe(0);
            });

            it('should throw an error when the employee does not exist', async () => {
                jest.spyOn(prisma.employee, 'findUnique').mockResolvedValue(null);
              
                await expect(service.getAllVestedOptionsOfEmployee(999)).rejects.toThrow('Employee not found');
            });
        })
    });

});
