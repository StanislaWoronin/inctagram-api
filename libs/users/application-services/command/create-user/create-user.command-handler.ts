import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { UserAggregate } from '../../../user.aggregate';
import { UserRepository } from '../../../providers/user.repository';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand, UserAggregate>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute(data: CreateUserCommand): Promise<UserAggregate> {
    const user = UserAggregate.create(data.user);
    await this.userRepository.createUser(user);
    return user;
  }
}
