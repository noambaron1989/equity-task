import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface QDCriteria {
    maxSharePrice: number;
    companyName: string;
    minimumInvestmentAmount: number;
    remainingAllocation: number; 
}

@Injectable()
export class GrantService {
    constructor(private prisma: PrismaService) {}


    calculateEquityPrice(sharePrice: number, totalNumberOfVestedShares: number): number {
        // TODO: @noambaron1989 include tax calculation based on state and domestic status
        return sharePrice * totalNumberOfVestedShares;
    }

    async getAllEquityOfEmployee(employeeId: number): Promise<number> {
        const employee = await this.prisma.employee.findUnique({
            where: { id: employeeId },
            include: { equityGrants: true }
        });
        
        if (!employee) {
            throw new Error('Employee not found');
        }
        
        let totalEquity = 0.0;
        for (const equityGrant of employee.equityGrants) {
            const grantPrice = this.calculateEquityPrice(equityGrant.sharePrice, equityGrant.totalNumberOfVestedShares); 
            totalEquity+= grantPrice;
        }

        return totalEquity;
    }

    async getAllEquityOfCompany(companyId: number): Promise<number> {
        const company = await this.prisma.company.findUnique({
            where: { id: companyId },
            include: { equityGrants: true }
        });
        
        if (!company) {
            throw new Error('Company not found');
        }
        
        let totalEquity = 0.0;
        for (const equityGrant of company.equityGrants) {
            const grantPrice = this.calculateEquityPrice(equityGrant.sharePrice, equityGrant.totalNumberOfVestedShares);
            totalEquity+= grantPrice;
        }

        return totalEquity;
    }

    async isEmployeeMeetsQuantifiedDemandCriteria(qdCriteria: QDCriteria, employeeId: number): Promise<boolean>{
        const employee = await this.prisma.employee.findUnique({
            where: { id: employeeId },
            include: { equityGrants: {include: {company: true}} ,}
        });

        if (!employee) {
            throw new Error('Employee not found');
        }

        if (!employee.equityGrants){
            return false
        }

        for (const equityGrant of employee.equityGrants) {
            const companyName = equityGrant.company.name;
            const sharePrice = equityGrant.sharePrice;
            const vestedOptions = equityGrant.totalNumberOfVestedShares;
            const fundingRequest = this.calculateEquityPrice(sharePrice, vestedOptions);

            if(companyName === qdCriteria.companyName && 
                fundingRequest >=qdCriteria.minimumInvestmentAmount && 
                sharePrice<=qdCriteria.maxSharePrice && 
                qdCriteria.remainingAllocation >= fundingRequest){
                return true
            }
        
        }
        return false 
    }
 
}
