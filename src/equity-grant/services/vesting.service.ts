import { Injectable } from '@nestjs/common';
import { EquityGrant } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export enum VestingStatus {
    PENDING = 'Pending',
    IN_PROGRESS = 'In Progress',
    VESTED = 'Vested'
}

export interface VestingSchedule {
    [key: string]: number; 
  }
  

@Injectable()
export class VestingService {
    constructor(private prisma: PrismaService) {}

    calculateVestingSchedule(grant: EquityGrant): VestingSchedule {
        const schedule = {};
        const monthsToVest = grant.vestingPeriod * 12; // Convert years to months
        const vestedSharesPerMonth = grant.totalNumberOfShares / monthsToVest;

        for (let month = 1; month <= monthsToVest; month++) {
        schedule[`month${month}`] = vestedSharesPerMonth * month;
        }

        return schedule;
    }

    getVestingStatus(grant: EquityGrant): string {
        // Assuming grant includes 'grantDate' and 'vestingPeriod'
        const startDate = new Date(grant.grantDate);
        const endDate = new Date(startDate.getFullYear() + grant.vestingPeriod, startDate.getMonth(), startDate.getDate());
        const today = new Date();

        if (today < startDate) {
            return VestingStatus.PENDING;
        } else if (today >= startDate && today <= endDate) {
            return VestingStatus.IN_PROGRESS;
        } else {
            return VestingStatus.VESTED;
        }
    }

    async getAllVestedOptionsOfEmployee(employeeId: number): Promise<number> {
        const employee = await this.prisma.employee.findUnique({
            where: { id: employeeId },
            include: { equityGrants: true }
        });
        
        if (!employee) {
            throw new Error('Employee not found');
        }

        let totalVestedOptions = 0;
        for (const equityGrant of employee.equityGrants) {
            totalVestedOptions+= equityGrant.totalNumberOfVestedShares;
        }

        return totalVestedOptions;
    }

}
