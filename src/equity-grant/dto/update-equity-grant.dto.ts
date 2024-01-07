import { IsDate, IsNumber, IsOptional, IsPositive, IsEnum } from 'class-validator';
import { GrantType } from '@prisma/client';

export class UpdateEquityGrantDto {
  @IsOptional()
  @IsDate()
  grantDate?: Date;

  @IsOptional()
  @IsEnum(GrantType)
  grantType?: GrantType;

  @IsOptional()
  @IsDate()
  exerciseDate?: Date;

  @IsOptional()
  @IsDate()
  deadline?: Date;

  @IsOptional()
  @IsNumber()
  sharePrice?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  totalNumberOfShares?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  totalNumberOfVestedShares?: number;
}
