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
import { LoginUserCommand } from './commands/login-user.command-handler';
import { ConfirmationCodeResendingCommand } from './commands/confirmation-code-resending-command.handler';
import { RegistrationConfirmationCommand } from './commands/registration-confirmation.command-handler';
import { PasswordRecoveryCommand } from './commands/password-recovery.command-handler';
import { CreateUserCommand } from './commands/create-user.command-handler';
import { UpdatePairTokenCommand } from './commands/update-pair-token.command-handler';
import { UpdatePasswordCommand } from './commands/update-password.command-handler';
import { LogoutCommand } from './commands/logout-command-handler';
import { UserAggregate } from '../schema';
import { GetUserByIdOrUserNameOrEmailCommand } from './queries/get-user-by-id-userName-or-email-query';
import { GetUserByConfirmationCodeCommand } from './queries/get-user-by-confirmation-code-query';
import { GetUserByRecoveryCodeCommand } from './queries/get-user-by-recovery-code-query';
import { DeleteUserByIdCommand } from './commands/delete-user-by-id.command-handler';

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
    deleteUserById: (id: string) => this.deleteUserById(id),
  };
  queries = {
    getUserByIdOrUserNameOrEmail: (loginOrEmail: string) =>
      this.getUserByIdOrUserNameOrEmail(loginOrEmail),
    getUserByConfirmationCode: (code: number) =>
      this.getUserByConfirmationCode(code),
    getUserByRecoveryCode: (code: number) => this.getUserByRecoveryCode(code),
  };

  private async loginUser(
    dto: WithClientMeta<LoginDto>,
  ): Promise<PairTokenResponse> {
    const command = new LoginUserCommand(dto);
    return await this.commandBus.execute(command);
  }

  private async logout(dto: SessionIdDto): Promise<boolean> {
    const command = new LogoutCommand(dto);
    return await this.commandBus.execute(command);
  }

  private async confirmationCodeResending(dto: EmailDto): Promise<boolean> {
    const command = new ConfirmationCodeResendingCommand(dto.email);
    return await this.commandBus.execute(command);
  }

  private async registrationConfirmation(
    dto: RegistrationConfirmationDto,
  ): Promise<boolean> {
    const command = new RegistrationConfirmationCommand(dto.confirmationCode);
    return await this.commandBus.execute(command);
  }

  private async passwordRecovery(dto: EmailDto): Promise<boolean> {
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

  private async updatePassword(dto: NewPasswordDto): Promise<boolean> {
    const command = new UpdatePasswordCommand(dto);
    return await this.commandBus.execute(command);
  }

  private async deleteUserById(id: string): Promise<boolean> {
    const command = new DeleteUserByIdCommand(id);
    return await this.commandBus.execute(command);
  }

  //Queries
  private async getUserByIdOrUserNameOrEmail(
    loginOrEmail: string,
  ): Promise<UserAggregate | null> {
    const command = new GetUserByIdOrUserNameOrEmailCommand(loginOrEmail);
    return await this.queryBus.execute(command);
  }

  private async getUserByConfirmationCode(
    code: number,
  ): Promise<UserAggregate | null> {
    const command = new GetUserByConfirmationCodeCommand(code);
    return await this.queryBus.execute(command);
  }
  private async getUserByRecoveryCode(
    code: number,
  ): Promise<UserAggregate | null> {
    const command = new GetUserByRecoveryCodeCommand(code);
    return await this.queryBus.execute(command);
  }
}
