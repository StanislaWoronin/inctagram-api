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

@Module({
  imports: [
    //ProvidersModule,
    MongooseModule.forRootAsync({
      useClass: MongooseConfig,
    }),
    MongooseModule.forFeature([
      { name: UserAggregate.name, schema: UserSchema },
    ]), // TODO providermodule
    CqrsModule,
    SharedModule,
    ClientsModule.register([getProviderOptions(Microservices.Auth)]),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    ...USER_COMMANDS_HANDLERS,
    ...USER_QUERIES_HANDLERS,
    {
      provide: UserFacade,
      inject: [CommandBus, QueryBus],
      useFactory: userFacadeFactory,
    },
    UserRepository,
    UserQueryRepository,
  ],
  exports: [UserFacade],
})
export class AuthModule implements OnModuleInit {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  onModuleInit(): any {
    this.commandBus.register(USER_COMMANDS_HANDLERS);
    this.queryBus.register(USER_QUERIES_HANDLERS);
  }
}
