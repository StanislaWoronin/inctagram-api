import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.reciever';
import { SharedModule } from '../../../libs';
import { ClientsModule } from '@nestjs/microservices';
import { getProviderOptions } from '../../../libs/providers/rabbit-mq/providers.option';
import { Microservices } from '../../../libs/shared';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../../../libs/users/user.module';
import {
  EmailAdapters,
  EmailManager,
} from '../../../libs/adapters/email.adapter';

@Module({
  imports: [
    UserModule,
    CqrsModule,
    SharedModule,
    ClientsModule.register([getProviderOptions(Microservices.Auth)]),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [EmailAdapters, EmailManager],
  exports: [],
})
export class AuthModule {}
