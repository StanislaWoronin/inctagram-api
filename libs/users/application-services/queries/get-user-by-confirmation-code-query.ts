import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserQueryRepository } from '../../providers/user.query.repository';
import { UserAggregate } from '../../schema';
import { RpcException } from '@nestjs/microservices';
import { preparedLoginData } from '../../../../test/prepared-data/prepared-user.data';

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
    console.log({ query });
    const user = await this.userQueryRepository.getUserByConfirmationCode(
      query.code,
    );
    if (!user) {
      throw new RpcException('Not found');
    }
    if (user.emailConfirmation.isConfirmed) {
      throw new RpcException('User already confirmed');
    }
    if (user.emailConfirmation.confirmationCode !== query.code) {
      throw new RpcException('Wrong code');
    }
    const currentTime = Date.now();
    if (user.emailConfirmation.confirmationCode < currentTime) {
      throw new RpcException('Code expired');
    }
    return user;
  }
}
