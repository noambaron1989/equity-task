import { Module } from '@nestjs/common';
import { EquityGrantModule } from './equity-grant/equity-grant.module'; // Import the EquityGrantsModule

@Module({
  imports: [EquityGrantModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
