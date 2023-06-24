import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserQueryRepository } from '../../providers/user.query.repository';
import { UserAggregate } from '../../schema';
import { BadRequestException } from '@nestjs/common';

export class GetUserByConfirmationCodeCommand {
  constructor(public readonly code: string) {}
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
    const user = await this.userQueryRepository.getUserByConfirmationCode(
      query.code,
    );
    if (!user) {
      throw new BadRequestException('Not found');
    }
    if (user.emailConfirmation.isConfirmed) {
      throw new BadRequestException('User already confirmed');
    }
    if (user.emailConfirmation.confirmationCode !== query.code) {
      throw new BadRequestException('Wrong code');
    }
    const currentTime = new Date().toISOString();
    if (user.emailConfirmation.expirationDate < currentTime) {
      throw new BadRequestException('Code expired');
    }
    return user;
  }
}
