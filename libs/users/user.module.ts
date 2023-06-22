import { Module, OnModuleInit } from '@nestjs/common';
import { CommandBus, CqrsModule, EventBus, QueryBus } from '@nestjs/cqrs';
import { UserFacade } from './application-services';
import { USER_QUERIES_HANDLERS } from './application-services/queries';
import { USER_COMMANDS_HANDLERS } from './application-services/command';
import { userFacadeFactory } from './application-services/user-facade.factory';
import { UserRepository } from './providers/user.repository';
import { UserQueryRepository } from './providers/user.query.repository';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfig } from '../providers/mongo-db';
import { UserAggregate, UserSchema } from './schema';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forRootAsync({
      useClass: MongooseConfig,
    }),
    MongooseModule.forFeature([
      { name: UserAggregate.name, schema: UserSchema },
    ]),
  ],
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
    JwtService,
  ],
  exports: [UserFacade],
})
export class UserModule implements OnModuleInit {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  onModuleInit(): any {
    this.commandBus.register(USER_COMMANDS_HANDLERS);
    this.queryBus.register(USER_QUERIES_HANDLERS);
  }
}
