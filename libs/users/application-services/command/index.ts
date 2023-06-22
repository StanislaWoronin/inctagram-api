import { Type } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommandHandler } from './create-user';
import { LoginUserCommandHandler } from './login-user';
import { UpdatePairTokenCommandHandler } from './update-pair-token';
import { LogoutCommandHandler } from './logout/logout.command-handler';

// Commands
export * from './create-user/create-user.command';
export * from './logout/logout.command';
export * from './login-user/login-user.command';

// Commands handler
export * from './create-user/create-user.command-handler';
export * from './logout/logout.command-handler';
export * from './login-user/login-user.command-handler';

export const USER_COMMANDS_HANDLERS: Type<ICommandHandler>[] = [
  CreateUserCommandHandler,
  LoginUserCommandHandler,
  UpdatePairTokenCommandHandler,
  LogoutCommandHandler,
];
