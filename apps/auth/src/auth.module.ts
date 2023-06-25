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
import { TestingRepository } from './testing.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfig } from '../../../libs/providers/mongo-db';
import { UserAggregate, UserSchema } from '../../../libs/users/schema';
import { IsConfirmationCodeExistConstraint } from '../../../libs/decorators/confirmation-code.decorator';
import { IsLoginExistConstraint } from '../../../libs/decorators/login.decorator';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongooseConfig,
    }),
    MongooseModule.forFeature([
      { name: UserAggregate.name, schema: UserSchema },
    ]),
    UserModule,
    CqrsModule,
    SharedModule,
    ClientsModule.register([getProviderOptions(Microservices.Auth)]),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    TestingRepository,
    IsConfirmationCodeExistConstraint,
    IsLoginExistConstraint,
  ],
  exports: [],
})
export class AuthModule {}
