import { Module } from '@nestjs/common';
import { EquityGrantController } from './equity-grant.controller';
import { EquityGrantService } from './equity-grant.service';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [EquityGrantController],
  providers: [EquityGrantService, PrismaClient],
})
export class EquityGrantModule {}
