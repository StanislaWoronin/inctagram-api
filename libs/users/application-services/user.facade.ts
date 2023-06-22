import { Injectable } from '@nestjs/common';
import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import { RegistrationDto, SessionIdDto } from '../dto';
import {
  CreateUserCommand,
  CreateUserCommandHandler,
  LogoutCommand,
  LogoutCommandHandler,
} from './command';
import { LoginDto } from '../../../apps/auth/dto/login.dto';
import {
  LoginUserCommand,
  LoginUserCommandHandler,
} from './command/login-user';
import {
  UpdatePairTokenCommand,
  UpdatePairTokenCommandHandler,
} from './command/update-pair-token';

@Injectable()
export class UserFacade {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  commands = {
    registrationUser: (data: RegistrationDto) => this.registrationUser(data),
    loginUser: (data: LoginDto) => this.loginUser(data),
    updatePairToken: (data: SessionIdDto) => this.updatePairToken(data),
    logout: (userId: string) => this.logout(userId),
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

  private updatePairToken(data: SessionIdDto) {
    return this.commandBus.execute<
      UpdatePairTokenCommand,
      UpdatePairTokenCommandHandler['execute']
    >(new UpdatePairTokenCommand(data));
  }

  private logout(userId: string) {
    return this.commandBus.execute<
      LogoutCommand,
      LogoutCommandHandler['execute']
    >(new LogoutCommand(userId));
  }
}
