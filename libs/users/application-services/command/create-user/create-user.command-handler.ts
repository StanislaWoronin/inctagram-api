import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { UserRepository } from '../../../providers/user.repository';
import { UserAggregate } from '../../../schema';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand, boolean>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ dto }: CreateUserCommand): Promise<boolean> {
    try {
      const newUser = await UserAggregate.create(dto);
      await this.userRepository.createUser(newUser);
      return true;
    } catch (e) {
      throw new BadRequestException();
    }
  }
}
