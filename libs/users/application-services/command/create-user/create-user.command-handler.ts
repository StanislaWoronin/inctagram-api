import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { UserRepository } from '../../../providers/user.repository';
import { UserAggregate } from '../../../schema';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand, boolean>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ dto }: CreateUserCommand): Promise<boolean> {
    try {
      const newUser = await UserAggregate.create(dto);
      const createdUser = await this.userRepository.createUser(newUser);
      if (!createdUser) {
        throw new Error('Something went wrong.');
      }
      return true;
    } catch (e) {
      console.log(e); // check it
      throw new BadRequestException();
      return false;
    }
  }
}
