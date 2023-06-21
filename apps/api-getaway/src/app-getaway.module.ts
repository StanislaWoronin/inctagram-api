import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { SharedModule } from '../../../libs';
import { Microservices } from '../../../libs/shared';
import { ClientsModule } from '@nestjs/microservices';
import { getProviderOptions } from '../../../libs/providers/rabbit-mq/providers.option';

@Module({
  imports: [
    SharedModule,
    ClientsModule.register([
        getProviderOptions(Microservices.Auth)
    ]),
  ],
  controllers: [AuthController],
})
export class AppGetawayModule {}
