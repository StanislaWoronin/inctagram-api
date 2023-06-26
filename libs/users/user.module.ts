import { Module, OnModuleInit } from '@nestjs/common';
import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import {
  USER_COMMANDS_HANDLERS,
  USER_QUERIES_HANDLERS,
  UserFacade,
} from './application-services';
import { userFacadeFactory } from './application-services/user-facade.factory';
import { UserRepository } from './providers/user.repository';
import { UserQueryRepository } from './providers/user.query.repository';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfig } from '../providers/mongo-db';
import { UserAggregate, UserSchema } from './schema';
import { EmailAdapters, EmailManager } from '../adapters/email.adapter';
import { IsConfirmationCodeExistConstraint } from '../decorators/confirmation-code.decorator';
import { IsLoginExistConstraint } from '../decorators/login.decorator';
import { Factory } from '../shared/tokens.factory';

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
    Factory,
    UserRepository,
    UserQueryRepository,
    JwtService,
    EmailAdapters,
    EmailManager,
    IsConfirmationCodeExistConstraint,
    IsLoginExistConstraint,
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
