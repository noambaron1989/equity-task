import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { EquityGrantService } from './equity-grant.service';
import { EquityGrant as EquityGrantModel } from '@prisma/client';
import { CreateEquityGrantDto } from './dto/create-equity-grant.dto';
import { UpdateEquityGrantDto } from './dto/update-equity-grant.dto';

@Controller('equity-grant')
export class EquityGrantController {
  constructor(private readonly equityGrantService: EquityGrantService) {}

  @Get()
  async getAllEquityGrants(): Promise<EquityGrantModel[]> {
    try {
      const equityGrants = await this.equityGrantService.getAllEquityGrants();
      return equityGrants;
    } catch (error) {
      console.error('Error fetching equity grants:', error.message);
      throw new InternalServerErrorException('Failed to fetch equity grants');
    }
  }

  @Get(':id') 
  async getEquityGrantById(@Param('id') id: string): Promise<EquityGrantModel> {
      return this.equityGrantService.getEquityGrantById(+id);
  }

  @Post()
  async createEquityGrant(
    @Body() createEquityGrantDto: CreateEquityGrantDto,
  ): Promise<EquityGrantModel> {
    try {
      const equityGrant = await this.equityGrantService.createEquityGrant(createEquityGrantDto);
      return equityGrant;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error creating equity grant:', error.message);
      throw new InternalServerErrorException('Failed to create equity grant');
    }
  }

  @Put(':id')
  async updateEquityGrant(
    @Param('id') id: string,
    @Body() updateEquityGrantDto: UpdateEquityGrantDto,
  ): Promise<EquityGrantModel> {
    try {
      const equityGrant = await this.equityGrantService.updateEquityGrant(+id, updateEquityGrantDto);
      return equityGrant;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(`Error updating equity grant with ID ${id}:`, error.message);
      throw new InternalServerErrorException('Failed to update equity grant');
    }
  }

  @Delete(':id')
  async deleteEquityGrant(@Param('id') id: string): Promise<EquityGrantModel> {
    try {
      const deletedGrant = await this.equityGrantService.deleteEquityGrant(+id);
      return deletedGrant
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(`Error deleting equity grant with ID ${id}:`, error.message);
      throw new InternalServerErrorException('Failed to delete equity grant');
    }
  }
}
