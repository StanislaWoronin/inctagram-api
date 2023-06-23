import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { UserRepository } from '../../../providers/user.repository';
import { UserAggregate } from '../../../schema';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand, UserAggregate>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute(data: CreateUserCommand): Promise<UserAggregate> {
    const user = await UserAggregate.create(data.user);
    await this.userRepository.createUser(user);
    return user;
  }
}
