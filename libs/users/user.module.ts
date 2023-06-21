import { Module, OnModuleInit } from '@nestjs/common';
import { CommandBus, CqrsModule, EventBus, QueryBus } from '@nestjs/cqrs';
import { UserFacade } from './application-services';

@Module({
  imports: [CqrsModule],
  providers: [
    ...USER_COMMANDS_HANDLERS,
    ...USER_QUERIES_HANDLERS,
    {
      provide: UserFacade,
      inject: [CommandBus, QueryBus],
      useFactory: userFacadeFactory,
    },
  ],
  exports: [UserFacade],
})
export class UserModule implements OnModuleInit {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  onModuleInit(): any {
    this.commandBus.register();
    this.queryBus.register();
  }
}
