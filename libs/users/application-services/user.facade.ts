import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { RegistrationDto, SessionIdDto, UpdatePasswordDto } from '../dto';
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
  UpdatePasswordCommand,
  UpdatePasswordCommandHandler,
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
    loginUser: (dto: LoginDto) => this.loginUser(dto),
    logout: (dto: SessionIdDto) => this.logout(dto),
    passwordRecovery: (email: string) => this.passwordRecovery(email),
    registrationUser: (data: RegistrationDto) => this.registrationUser(data),
    updatePairToken: (dto: SessionIdDto) => this.updatePairToken(dto),
    updatePassword: (data: UpdatePasswordDto) => this.updatePassword(data),
  };
  queries = {};

  private async loginUser(dto: LoginDto) {
    return this.commandBus.execute<
      LoginUserCommand,
      LoginUserCommandHandler['execute']
    >(new LoginUserCommand(dto));
  }

  private logout(dto: SessionIdDto) {
    return this.commandBus.execute<
      LogoutCommand,
      LogoutCommandHandler['execute']
    >(new LogoutCommand(dto));
  }

  private passwordRecovery(email: string) {
    return this.commandBus.execute<
      PasswordRecoveryCommand,
      PasswordRecoveryCommandHandler['execute']
    >(new PasswordRecoveryCommand(email));
  }

  private registrationUser(dto: RegistrationDto) {
    return this.commandBus.execute<
      CreateUserCommand,
      CreateUserCommandHandler['execute']
    >(new CreateUserCommand(dto));
  }

  private updatePairToken(dto: SessionIdDto) {
    return this.commandBus.execute<
      UpdatePairTokenCommand,
      UpdatePairTokenCommandHandler['execute']
    >(new UpdatePairTokenCommand(dto));
  }

  private updatePassword(dto: UpdatePasswordDto) {
    return this.commandBus.execute<
      UpdatePasswordCommand,
      UpdatePasswordCommandHandler
    >(new UpdatePasswordCommand(dto));
  }
}
