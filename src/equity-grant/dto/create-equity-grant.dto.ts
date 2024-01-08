import { IsDate, IsNotEmpty, IsNumber, IsPositive, ValidateNested, IsEnum } from 'class-validator';
import { GrantType } from '@prisma/client';
import { Type } from 'class-transformer';

class EmployeeDto {
  @IsNumber()
  @IsNotEmpty()
  employeeId: number;
}

class CompanyDto {
  @IsNumber()
  @IsNotEmpty()
  companyId: number;
}

export class CreateEquityGrantDto {
  @ValidateNested()
  @Type(() => EmployeeDto)
  @IsNotEmpty()
  employee: EmployeeDto;

  @ValidateNested()
  @Type(() => CompanyDto)
  @IsNotEmpty()
  company: CompanyDto;

  @IsDate()
  @IsNotEmpty()
  grantDate: Date;

  @IsEnum(GrantType)
  @IsNotEmpty()
  grantType: GrantType;

  @IsDate()
  @IsNotEmpty()
  exerciseDate: Date;

  @IsDate()
  @IsNotEmpty()
  deadline: Date;

  @IsNumber()
  @IsNotEmpty()
  sharePrice: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  totalNumberOfShares: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  totalNumberOfVestedShares: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  vestingPeriod: number;
}
