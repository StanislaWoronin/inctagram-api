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
import {
  EmailConfirmationCodeResendingCommand,
  EmailConfirmationCodeResendingCommandHandler,
} from './command/email-confirmation-code-resending';
import {PairTokenResponse, ViewUser} from "../response";

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
    emailConfirmationCodeResending: (email: string) =>
      this.emailConfirmationCodeResending(email),
  };
  queries = {};

  private async loginUser(dto: LoginDto): Promise<PairTokenResponse> {
    const command = new LoginUserCommand(dto);
    return await this.commandBus.execute(command);
  }

  private logout(dto: SessionIdDto) {
    const command = new LogoutCommand(dto);
    return this.commandBus.execute(command);
  }

  private emailConfirmationCodeResending(email: string) {
    const command = new EmailConfirmationCodeResendingCommand(email);
    return this.commandBus.execute(command);
  }

  private passwordRecovery(email: string) {
    const command = new PasswordRecoveryCommand(email);
    return this.commandBus.execute(command);
  }

  private async registrationUser(dto: RegistrationDto): Promise<ViewUser> {
    const command = new CreateUserCommand(dto);
    return await this.commandBus.execute(command);
  }

  private updatePairToken(dto: SessionIdDto) {
    const command = new UpdatePairTokenCommand(dto);
    return this.commandBus.execute(command);
  }

  private updatePassword(dto: UpdatePasswordDto) {
    const command = new UpdatePasswordCommand(dto);
    return this.commandBus.execute(command);
  }
}
