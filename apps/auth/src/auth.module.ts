import { Module, OnModuleInit } from '@nestjs/common';
import { AuthController } from './auth.controller.reciever';
import { SharedModule } from '../../../libs';
import { ClientsModule } from '@nestjs/microservices';
import { getProviderOptions } from '../../../libs/providers/rabbit-mq/providers.option';
import { Microservices } from '../../../libs/shared';
import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { UserFacade } from '../../../libs/users/application-services';
import { userFacadeFactory } from '../../../libs/users/application-services/user-facade.factory';
import { USER_COMMANDS_HANDLERS } from '../../../libs/users/application-services/command';
import { USER_QUERIES_HANDLERS } from '../../../libs/users/application-services/queries';
import { UserRepository } from '../../../libs/users/providers/user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfig } from '../../../libs/providers/mongo-db';
import { UserAggregate, UserSchema } from '../../../libs/users/schema';
import { UserQueryRepository } from '../../../libs/users/providers/user.query.repository';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../../../libs/users/user.module';

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
