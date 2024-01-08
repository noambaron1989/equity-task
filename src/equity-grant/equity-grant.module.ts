import { Module } from '@nestjs/common';
import { EquityGrantController } from './equity-grant.controller';
import { EquityGrantService } from './equity-grant.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [EquityGrantController],
  imports: [ConfigModule.forRoot()],
  providers: [EquityGrantService, PrismaService, ConfigModule],
})
export class EquityGrantModule {}
