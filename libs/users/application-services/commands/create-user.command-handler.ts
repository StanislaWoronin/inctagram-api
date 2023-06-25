import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../providers/user.repository';
import { UserAggregate } from '../../schema';
import { BadRequestException } from '@nestjs/common';
import { ViewUser } from '../../response';
import { EmailManager } from '../../../adapters/email.adapter';
import { randomUUID } from 'crypto';
import { TRegistration } from '../../../../apps/auth/dto';

export class CreateUserCommand {
  constructor(public readonly dto: TRegistration) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand, ViewUser>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailManager: EmailManager,
  ) {}

  async execute(command: CreateUserCommand): Promise<ViewUser> {
    try {
      const newUser = await UserAggregate.create(command.dto);
      const confirmationCode = randomUUID();
      newUser.emailConfirmation.confirmationCode = confirmationCode;
      const createdUser = await this.userRepository.createUser(newUser);
      await this.emailManager.sendConfirmationEmail(
        createdUser.email,
        confirmationCode,
      );

      return ViewUser.create(createdUser);
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }
}
