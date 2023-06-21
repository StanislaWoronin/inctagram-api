import { Injectable } from '@nestjs/common';
import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import { RegistrationDto } from '../dto';
import {
  CreateUserCommand,
  CreateUserCommandHandler,
} from './command/create-user';

@Injectable()
export class UserFacade {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  commands = {
    registrationUser: (data: RegistrationDto) => this.registrationUser(data),
  };
  queries = {};

  private registrationUser(data: RegistrationDto) {
    return this.commandBus.execute<
      CreateUserCommand,
      CreateUserCommandHandler['execute']
    >(new CreateUserCommand(data));
  }
}
