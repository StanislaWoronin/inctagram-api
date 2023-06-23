import { Type } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommandHandler } from './create-user';
import { LoginUserCommandHandler } from './login-user';
import { UpdatePairTokenCommandHandler } from './update-pair-token';
import { LogoutCommandHandler } from './logout/logout.command-handler';
import { PasswordRecoveryCommandHandler } from './password-recovery';

// Commands
export * from './create-user/create-user.command';
export * from './logout/logout.command';
export * from './login-user/login-user.command';
export * from './password-recovery/password-recovery.command';

// Commands handler
export * from './create-user/create-user.command-handler';
export * from './logout/logout.command-handler';
export * from './login-user/login-user.command-handler';
export * from './password-recovery/password-recovery.command-handler';

export const USER_COMMANDS_HANDLERS: Type<ICommandHandler>[] = [
  CreateUserCommandHandler,
  LoginUserCommandHandler,
  LogoutCommandHandler,
  PasswordRecoveryCommandHandler,
  UpdatePairTokenCommandHandler,
];
