import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserQueryRepository } from '../../providers/user.query.repository';
import { UserAggregate } from '../../schema';

export class GetUserByLoginOrEmailCommand {
  constructor(public readonly loginOrEmail: string) {}
}

@QueryHandler(GetUserByLoginOrEmailCommand)
export class GetUserByLoginOrEmailQuery
  implements IQueryHandler<GetUserByLoginOrEmailCommand, UserAggregate | null>
{
  constructor(private userQueryRepository: UserQueryRepository) {}

  async execute(
    query: GetUserByLoginOrEmailCommand,
  ): Promise<UserAggregate | null> {
    return await this.userQueryRepository.getUserByField(query.loginOrEmail);
  }
}
