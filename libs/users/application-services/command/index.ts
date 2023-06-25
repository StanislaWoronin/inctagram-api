import { Type } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommandHandler } from './create-user';
import { LoginUserCommandHandler } from './login-user';
import { UpdatePairTokenCommandHandler } from './update-pair-token';
import { LogoutCommandHandler } from './logout/logout.command-handler';
import { PasswordRecoveryCommandHandler } from './password-recovery';
import { UpdatePasswordCommandHandler } from './update-password';
import { ConfirmationCodeResendingCommandHandler } from './email-confirmation-code-resending';
import { RegistrationConfirmationCommandHandler } from './registration-confirmation';

export * from './create-user';
export * from './email-confirmation-code-resending';
export * from './login-user';
export * from './logout';
export * from './password-recovery';
export * from './registration-confirmation';
export * from './update-password';

export const USER_COMMANDS_HANDLERS: Type<ICommandHandler>[] = [
  CreateUserCommandHandler,
  LoginUserCommandHandler,
  LogoutCommandHandler,
  ConfirmationCodeResendingCommandHandler,
  RegistrationConfirmationCommandHandler,
  PasswordRecoveryCommandHandler,
  UpdatePairTokenCommandHandler,
  UpdatePasswordCommandHandler,
];
