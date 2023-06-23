import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PasswordRecoveryCommand } from './password-recovery.command';
import { UserQueryRepository } from '../../../providers/user.query.repository';
import { BadRequestException } from '@nestjs/common';
import { UserRepository } from '../../../providers/user.repository';
import { EmailManager } from '../../../../adapters/email.adapter';

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryCommandHandler
  implements ICommandHandler<PasswordRecoveryCommand>
{
  constructor(
    private userRepository: UserRepository,
    private userQueryRepository: UserQueryRepository,
    private emailManger: EmailManager,
  ) {}

  async execute({ email }: PasswordRecoveryCommand) {
    const user = await this.userQueryRepository.getUserByIdOrLoginOrEmail(
      email,
    );
    if (user) {
      const passwordRecovery = Date.now();
      const isSuccess = await this.userRepository.setPasswordRecovery(
        user.id,
        passwordRecovery,
      );
      if (isSuccess)
        this.emailManger.sendPasswordRecoveryEmail(email, passwordRecovery);

      return;
    }
  }
}
