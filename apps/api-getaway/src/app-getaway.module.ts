import { Module } from '@nestjs/common';
import { AppGetawayController } from './app-getaway.controller';
import { SharedModule } from '../../../libs';
import { Microservices } from '../../../libs/shared';
import { ClientsModule } from '@nestjs/microservices';
import { getProviderOptions } from '../../../libs/providers/providers.option';

@Module({
  imports: [
    SharedModule,
    ClientsModule.register([getProviderOptions(Microservices.Auth)]),
  ],
  controllers: [AppGetawayController],
  providers: [],
})
export class AppGetawayModule {}
