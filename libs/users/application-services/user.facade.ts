import { Injectable } from '@nestjs/common';
import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import { RegistrationDto } from '../dto';
import { CreateUserCommand, CreateUserCommandHandler } from './command';
import { LoginDto } from '../../../apps/auth/dto/login.dto';
import {
  LoginUserCommand,
  LoginUserCommandHandler,
} from './command/login-user';

@Injectable()
export class UserFacade {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  commands = {
    registrationUser: (data: RegistrationDto) => this.registrationUser(data),
    loginUser: (data: LoginDto) => this.loginUser(data),
  };
  queries = {};

  private registrationUser(data: RegistrationDto) {
    return this.commandBus.execute<
      CreateUserCommand,
      CreateUserCommandHandler['execute']
    >(new CreateUserCommand(data));
  }

  private loginUser(data: LoginDto) {
    return this.commandBus.execute<
      LoginUserCommand,
      LoginUserCommandHandler['execute']
    >(new LoginUserCommand(data));
  }
}
