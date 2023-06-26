import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserQueryRepository } from '../../providers/user.query.repository';
import { UserAggregate } from '../../schema';

export class GetUserByRecoveryCodeCommand {
  constructor(public readonly code: string) {}
}

@QueryHandler(GetUserByRecoveryCodeCommand)
export class GetUserByRecoveryCodeQuery
  implements IQueryHandler<GetUserByRecoveryCodeCommand, UserAggregate | null>
{
  constructor(private userQueryRepository: UserQueryRepository) {}

  async execute(
    query: GetUserByRecoveryCodeCommand,
  ): Promise<UserAggregate | null> {
    return await this.userQueryRepository.getUserByRecoveryCode(query.code);
  }
}
