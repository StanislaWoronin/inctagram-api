import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { UserAggregate } from '../../../user.aggregate';
import { UserRepository } from '../../../providers/user.repository';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand, UserAggregate>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: CreateUserCommand): Promise<UserAggregate> {
    const user = UserAggregate.create("user");
    await this.userRepository.createUser();
    return;
  }
}
