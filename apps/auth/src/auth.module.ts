import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
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
import { UserRepository } from '../../../libs/users/providers/user.repository';
import { UserQueryRepository } from '../../../libs/users/providers/user.query.repository';

@Module({
  imports: [
    UserModule,
    CqrsModule,
    SharedModule,
    ClientsModule.register([getProviderOptions(Microservices.Auth)]),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [],
  exports: [],
})
export class AuthModule {}
