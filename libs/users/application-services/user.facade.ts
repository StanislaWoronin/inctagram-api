import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  RegistrationDto,
  SessionIdDto,
  UpdatePasswordDto,
  WithClientMeta,
} from '../dto';
import { LoginDto } from '../../../apps/auth/dto/login.dto';
import {
  CreateUserCommand,
  LoginUserCommand,
  LogoutCommand,
  PasswordRecoveryCommand,
  UpdatePasswordCommand,
} from './command';
import { UpdatePairTokenCommand } from './command/update-pair-token';
import { PairTokenResponse, ViewUser } from '../response';
import { EmailConfirmationCodeResendingCommand } from './command/email-confirmation-code-resending';
import { GetUserByLoginOrEmailCommand } from './queries/get-user-by-login-or-email-query';
import { RegistrationConfirmationCommand } from './command/registration-confirmation';
import { GetUserByConfirmationCodeCommand } from './queries/get-user-by-confirmation-code-query';

@Injectable()
export class UserFacade {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  commands = {
    loginUser: (dto: WithClientMeta<LoginDto>) => this.loginUser(dto),
    logout: (dto: SessionIdDto) => this.logout(dto),
    passwordRecovery: (email: string) => this.passwordRecovery(email),
    registrationUser: (data: RegistrationDto) => this.registrationUser(data),
    updatePairToken: (dto: WithClientMeta<SessionIdDto>) =>
      this.updatePairToken(dto),
    updatePassword: (data: UpdatePasswordDto) => this.updatePassword(data),
    emailConfirmationCodeResending: (email: string) =>
      this.emailConfirmationCodeResending(email),
    registrationConfirmation: (code: string) =>
      this.registrationConfirmation(code),
  };
  queries = {
    getUserByIdOrLoginOrEmail: (loginOrEmail: string) =>
      this.getUserByIdOrLoginOrEmail(loginOrEmail),
    getUserByConfirmationCode: (code: string) =>
      this.getUserByConfirmationCode(code),
  };

  private async loginUser(
    dto: WithClientMeta<LoginDto>,
  ): Promise<PairTokenResponse> {
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

  private registrationConfirmation(code: string) {
    const command = new RegistrationConfirmationCommand(code);
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

  private updatePairToken(dto: WithClientMeta<SessionIdDto>) {
    const command = new UpdatePairTokenCommand(dto);
    return this.commandBus.execute(command);
  }

  private updatePassword(dto: UpdatePasswordDto) {
    const command = new UpdatePasswordCommand(dto);
    return this.commandBus.execute(command);
  }

  private async getUserByIdOrLoginOrEmail(
    loginOrEmail: string,
  ): Promise<ViewUser> {
    const command = new GetUserByLoginOrEmailCommand(loginOrEmail);
    return await this.queryBus.execute(command);
  }

  private async getUserByConfirmationCode(code: string): Promise<ViewUser> {
    const command = new GetUserByConfirmationCodeCommand(code);
    return await this.queryBus.execute(command);
  }
}
