import { Type } from '@nestjs/common';
import { ICommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { RegistrationConfirmationCommandHandler } from './commands/registration-confirmation.command-handler';
import { PasswordRecoveryCommandHandler } from './commands/password-recovery.command-handler';
import { CreateUserCommandHandler } from './commands/create-user.command-handler';
import { LoginUserCommandHandler } from './commands/login-user.command-handler';
import { LogoutCommandHandler } from './commands/logout-command-handler';
import { ConfirmationCodeResendingCommandHandler } from './commands/confirmation-code-resending-command.handler';
import { UpdatePairTokenCommandHandler } from './commands/update-pair-token.command-handler';
import { UpdatePasswordCommandHandler } from './commands/update-password.command-handler';
import { GetUserByLoginOrEmailQuery } from './queries/get-user-by-login-or-email-query';
import { GetUserByConfirmationCodeQuery } from './queries/get-user-by-confirmation-code-query';

export * from './user.facade';

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

export const USER_QUERIES_HANDLERS: Type<IQueryHandler>[] = [
  GetUserByLoginOrEmailQuery,
  GetUserByConfirmationCodeQuery,
];
