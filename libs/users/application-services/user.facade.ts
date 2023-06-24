import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SessionIdDto, WithClientMeta } from '../dto';
import {
  LoginDto,
  NewPasswordDto,
  TRegistration,
} from '../../../apps/auth/dto';
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
    registrationUser: (data: TRegistration) => this.registrationUser(data),
    updatePairToken: (dto: WithClientMeta<SessionIdDto>) =>
      this.updatePairToken(dto),
    updatePassword: (dto: NewPasswordDto) => this.updatePassword(dto),
    emailConfirmationResending: (email: string) =>
      this.emailConfirmationResending(email),
  };
  queries = {};

  private emailConfirmationResending(email: string) {
    const command = new EmailConfirmationCodeResendingCommand(email);
    return this.commandBus.execute(command);
  }

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

  private passwordRecovery(email: string) {
    const command = new PasswordRecoveryCommand(email);
    return this.commandBus.execute(command);
  }

  private async registrationUser(dto: TRegistration): Promise<ViewUser> {
    const command = new CreateUserCommand(dto);
    return await this.commandBus.execute(command);
  }

  private updatePairToken(dto: WithClientMeta<SessionIdDto>) {
    const command = new UpdatePairTokenCommand(dto);
    return this.commandBus.execute(command);
  }

  private updatePassword(dto: NewPasswordDto) {
    const command = new UpdatePasswordCommand(dto);
    return this.commandBus.execute(command);
  }
}
