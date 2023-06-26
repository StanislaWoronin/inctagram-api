import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserQueryRepository } from '../../providers/user.query.repository';
import { UserRepository } from '../../providers/user.repository';
import { randomUUID } from 'crypto';
import { settings } from '../../../shared/settings';

export class RegistrationConfirmationCommand {
  constructor(public readonly confirmationCode: number) {}
}

@CommandHandler(RegistrationConfirmationCommand)
export class RegistrationConfirmationCommandHandler
  implements ICommandHandler<RegistrationConfirmationCommand, boolean>
{
  constructor(
    private userRepository: UserRepository,
    private userQueryRepository: UserQueryRepository,
  ) {}

  async execute(command: RegistrationConfirmationCommand): Promise<boolean> {
    console.log(command);
    const user = await this.userQueryRepository.getUserByConfirmationCode(
      command.confirmationCode,
    );
    console.log(user);
    const newEmailConfirmationCode =
      Date.now() + settings.timeLife.CONFIRMATION_CODE;
    await this.userRepository.updateEmailConfirmationCode(
      user.id,
      newEmailConfirmationCode,
    );
    await this.userRepository.updateUserConfirmationStatus(user.id);
    return true;
  }
}
