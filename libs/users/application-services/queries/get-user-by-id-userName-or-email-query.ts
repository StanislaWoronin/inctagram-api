import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserQueryRepository } from '../../providers/user.query.repository';
import { UserAggregate } from '../../schema';

export class GetUserByIdOrUserNameOrEmailCommand {
  constructor(public readonly loginOrEmail: string) {}
}

@QueryHandler(GetUserByIdOrUserNameOrEmailCommand)
export class GetUserByIdUserNameOrEmailQuery
  implements
    IQueryHandler<GetUserByIdOrUserNameOrEmailCommand, UserAggregate | null>
{
  constructor(private userQueryRepository: UserQueryRepository) {}

  async execute(
    query: GetUserByIdOrUserNameOrEmailCommand,
  ): Promise<UserAggregate | null> {
    return await this.userQueryRepository.getUserByField(query.loginOrEmail);
  }
}
