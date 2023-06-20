import { Module, OnModuleInit } from '@nestjs/common';
import { CommandBus, CqrsModule, EventBus, QueryBus } from '@nestjs/cqrs';
import { UserFacade } from './application-services';

@Module({
  imports: [CqrsModule],
  providers: [
    {
      provide: UserFacade,
      inject: [CommandBus, QueryBus, EventBus],
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
