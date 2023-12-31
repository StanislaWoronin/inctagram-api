import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserQueryRepository } from '../../providers/user.query.repository';
import { UserRepository } from '../../providers/user.repository';
import { EmailManager } from '../../../adapters/email.adapter';
import { settings } from '../../../shared/settings';

export class PasswordRecoveryCommand {
  constructor(public readonly email: string) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryCommandHandler
  implements ICommandHandler<PasswordRecoveryCommand>
{
  constructor(
    private userRepository: UserRepository,
    private userQueryRepository: UserQueryRepository,
    private emailManger: EmailManager,
  ) {}

  async execute({ email }: PasswordRecoveryCommand): Promise<boolean> {
    const user = await this.userQueryRepository.getUserByField(email);
    if (user) {
      const passwordRecovery = Date.now() + settings.timeLife.CONFIRMATION_CODE;
      const isSuccess = await this.userRepository.setPasswordRecovery(
        user.id,
        passwordRecovery,
      );
      if (isSuccess)
        await this.emailManger.sendPasswordRecoveryEmail(
          email,
          passwordRecovery,
        );
    }
    return true;
  }
}
