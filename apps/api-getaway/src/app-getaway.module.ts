import { Module } from '@nestjs/common';
import { AppGetawayController } from './app-getaway.controller';
import { SharedModule } from '../../../libs';

@Module({
  imports: [SharedModule],
  controllers: [AppGetawayController],
  providers: [],
})
export class AppGetawayModule {}
