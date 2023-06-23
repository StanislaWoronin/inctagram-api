import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { UserRepository } from '../../../providers/user.repository';
import { UserAggregate } from '../../../schema';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand, any>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ dto }: CreateUserCommand) {
    try {
      const newUser = await UserAggregate.create(dto);
      return await this.userRepository.createUser(newUser);
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }
}
