import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserQueryRepository } from '../../../providers/user.query.repository';
import { UserRepository } from '../../../providers/user.repository';
import { randomUUID } from 'crypto';

export class RegistrationConfirmationCommand {
  constructor(public readonly code: string) {}
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
      command.code,
    );
    const newEmailConfirmationCode = randomUUID();
    await this.userRepository.updateEmailConfirmationCode(
      user.id,
      newEmailConfirmationCode,
    );
    await this.userRepository.updateUserEmailStatus(user.id, true);
    return true;
  }
}
