import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { RegistrationDto, SessionIdDto } from '../dto';
import { LoginDto } from '../../../apps/auth/dto/login.dto';
import {
  CreateUserCommand,
  CreateUserCommandHandler,
  LoginUserCommand,
  LoginUserCommandHandler,
  LogoutCommand,
  LogoutCommandHandler,
  PasswordRecoveryCommand,
  PasswordRecoveryCommandHandler,
} from './command';
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
    loginUser: (data: LoginDto) => this.loginUser(data),
    logout: (userId: string) => this.logout(userId),
    passwordRecovery: (email: string) => this.passwordRecovery(email),
    registrationUser: (data: RegistrationDto) => this.registrationUser(data),
    updatePairToken: (data: SessionIdDto) => this.updatePairToken(data),
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

  private passwordRecovery(email: string) {
    return this.commandBus.execute<
      PasswordRecoveryCommand,
      PasswordRecoveryCommandHandler['execute']
    >(new PasswordRecoveryCommand(email));
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
