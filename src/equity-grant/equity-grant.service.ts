import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, EquityGrant as EquityGrantModel } from '@prisma/client';
import { CreateEquityGrantDto } from './dto/create-equity-grant.dto';
import { UpdateEquityGrantDto } from './dto/update-equity-grant.dto';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class EquityGrantService {

  constructor(private prisma: PrismaService) {}
  

  async getAllEquityGrants(): Promise<EquityGrantModel[]> {
    return this.prisma.equityGrant.findMany();
  }

  async getEquityGrantById(id: number): Promise<EquityGrantModel> {
    const equityGrant = await this.prisma.equityGrant.findUnique({
      where: { id },
      include: {
        employee: true,
        company: true
      },
    });

    if (!equityGrant) {
      throw new NotFoundException(`Equity grant with ID ${id} not found.`);
    }

    return equityGrant;
  }

  async createEquityGrant(
    createEquityGrantDto: CreateEquityGrantDto,
  ): Promise<EquityGrantModel> {
    const { employee, company, ...restDto } = createEquityGrantDto;

    const createdEquityGrant = await this.prisma.equityGrant.create({
      data: {
        ...restDto,
        employee: {
          connect: { id: employee.employeeId },
        },
        company: {
          connect: { id: company.companyId },
        },
      },
    });

    return createdEquityGrant;
  }

  async updateEquityGrant(
    id: number,
    updateEquityGrantDto: UpdateEquityGrantDto,
  ): Promise<EquityGrantModel> {
    const { grantType, exerciseDate, deadline, sharePrice, totalNumberOfShares, totalNumberOfVestedShares } = updateEquityGrantDto;
    const data: Prisma.EquityGrantUpdateInput= {
      grantType,
      exerciseDate,
      deadline,
      sharePrice,
      totalNumberOfShares,
      totalNumberOfVestedShares,
    };

    const updatedGrant = await this.prisma.equityGrant.update({
      where: { id },
      data,
    });

    if (!updatedGrant) {
      throw new NotFoundException(`Equity grant with ID ${id} not found.`);
    }

    return updatedGrant;

  }

  async deleteEquityGrant(id: number): Promise<EquityGrantModel> {

    const deletedGrant = await this.prisma.equityGrant.delete({
      where: { id },
    });

    if (!deletedGrant) {
      throw new NotFoundException(`Equity grant with ID ${id} not found.`);
    }

    return deletedGrant;
  }
}
