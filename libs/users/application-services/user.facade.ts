import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  EmailDto,
  LoginDto,
  NewPasswordDto,
  RegistrationConfirmationDto,
  SessionIdDto,
  TRegistration,
  WithClientMeta,
} from '../../../apps/auth/dto';
import { PairTokenResponse, ViewUser } from '../response';
import { GetUserByLoginOrEmailCommand } from './queries/get-user-by-login-or-email-query';
import { GetUserByConfirmationCodeCommand } from './queries/get-user-by-confirmation-code-query';
import { LoginUserCommand } from './commands/login-user.command-handler';
import { ConfirmationCodeResendingCommand } from './commands/confirmation-code-resending-command.handler';
import { RegistrationConfirmationCommand } from './commands/registration-confirmation.command-handler';
import { PasswordRecoveryCommand } from './commands/password-recovery.command-handler';
import { CreateUserCommand } from './commands/create-user.command-handler';
import { UpdatePairTokenCommand } from './commands/update-pair-token.command-handler';
import { UpdatePasswordCommand } from './commands/update-password.command-handler';
import { LogoutCommand } from './commands/logout-command-handler';

@Injectable()
export class UserFacade {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  commands = {
    loginUser: (dto: WithClientMeta<LoginDto>) => this.loginUser(dto),
    logout: (dto: SessionIdDto) => this.logout(dto),
    passwordRecovery: (dto: EmailDto) => this.passwordRecovery(dto),
    registrationUser: (dto: TRegistration) => this.registrationUser(dto),
    updatePairToken: (dto: WithClientMeta<SessionIdDto>) =>
      this.updatePairToken(dto),
    updatePassword: (data: NewPasswordDto) => this.updatePassword(data),
    confirmationCodeResending: (dto: EmailDto) =>
      this.confirmationCodeResending(dto),
    registrationConfirmation: (dto: RegistrationConfirmationDto) =>
      this.registrationConfirmation(dto),
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

  private async logout(dto: SessionIdDto) {
    const command = new LogoutCommand(dto);
    return await this.commandBus.execute(command);
  }

  private async confirmationCodeResending(dto: EmailDto) {
    const command = new ConfirmationCodeResendingCommand(dto.email);
    return await this.commandBus.execute(command);
  }

  private async registrationConfirmation(dto: RegistrationConfirmationDto) {
    const command = new RegistrationConfirmationCommand(dto.confirmationCode);
    return await this.commandBus.execute(command);
  }

  private async passwordRecovery(dto: EmailDto) {
    const command = new PasswordRecoveryCommand(dto.email);
    return await this.commandBus.execute(command);
  }

  private async registrationUser(dto: TRegistration): Promise<ViewUser> {
    const command = new CreateUserCommand(dto);
    return await this.commandBus.execute(command);
  }

  private async updatePairToken(
    dto: WithClientMeta<SessionIdDto>,
  ): Promise<PairTokenResponse> {
    const command = new UpdatePairTokenCommand(dto);
    return await this.commandBus.execute(command);
  }

  private async updatePassword(dto: NewPasswordDto) {
    const command = new UpdatePasswordCommand(dto);
    return await this.commandBus.execute(command);
  }

  //Queries
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
