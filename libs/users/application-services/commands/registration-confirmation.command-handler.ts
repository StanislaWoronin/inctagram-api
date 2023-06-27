import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserQueryRepository } from '../../providers/user.query.repository';
import { UserRepository } from '../../providers/user.repository';

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
    const user = await this.userQueryRepository.getUserByConfirmationCode(
      command.confirmationCode,
    );
    await this.userRepository.updateUserConfirmationStatus(user.id);
    return true;
  }
}
