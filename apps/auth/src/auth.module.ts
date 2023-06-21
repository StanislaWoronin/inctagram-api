import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SharedModule } from '../../../libs';
import { ClientsModule } from '@nestjs/microservices';
import { getProviderOptions } from '../../../libs/providers/providers.option';
import { Microservices } from '../../../libs/shared';

@Module({
  imports: [
    SharedModule,
    ClientsModule.register([getProviderOptions(Microservices.Auth)]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
