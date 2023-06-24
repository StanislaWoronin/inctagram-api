import { IQueryHandler } from '@nestjs/cqrs';
import { Type } from '@nestjs/common';
import { GetUserByLoginOrEmailQuery } from './get-user-by-login-or-email-query';
import { GetUserByConfirmationCodeQuery } from './get-user-by-confirmation-code-query';

export const USER_QUERIES_HANDLERS: Type<IQueryHandler>[] = [
  GetUserByLoginOrEmailQuery,
  GetUserByConfirmationCodeQuery,
];
