import { IQueryHandler } from '@nestjs/cqrs';
import { Type } from '@nestjs/common';

export const USER_QUERIES_HANDLERS: Type<IQueryHandler>[] = [];
