import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserQueryRepository } from '../../providers/user.query.repository';
import { UserAggregate } from '../../schema';

export class GetUserByConfirmationCodeCommand {
  constructor(public readonly code: number) {}
}

@QueryHandler(GetUserByConfirmationCodeCommand)
export class GetUserByConfirmationCodeQuery
  implements
    IQueryHandler<GetUserByConfirmationCodeCommand, UserAggregate | null>
{
  constructor(private userQueryRepository: UserQueryRepository) {}

  async execute(
    query: GetUserByConfirmationCodeCommand,
  ): Promise<UserAggregate | null> {
    return await this.userQueryRepository.getUserByConfirmationCode(query.code);
  }
}
