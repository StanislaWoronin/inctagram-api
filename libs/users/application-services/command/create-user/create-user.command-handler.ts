import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { UserRepository } from '../../../providers/user.repository';
import { UserAggregate } from '../../../schema';
import { BadRequestException } from '@nestjs/common';
import { ViewUser } from "../../../response";

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand, ViewUser>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ dto }: CreateUserCommand): Promise<ViewUser> {
    try {
      const newUser = await UserAggregate.create(dto);
      const createdUser = await this.userRepository.createUser(newUser);
      return ViewUser.create(createdUser);
    } catch (e) {
      throw new BadRequestException();
    }
  }
}
