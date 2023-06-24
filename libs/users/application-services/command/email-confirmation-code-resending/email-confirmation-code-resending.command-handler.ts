import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserQueryRepository } from '../../../providers/user.query.repository';
import { UserRepository } from '../../../providers/user.repository';
import { EmailManager } from '../../../../adapters/email.adapter';
import { randomUUID } from 'crypto';

export class EmailConfirmationCodeResendingCommand {
  constructor(public readonly email: string) {}
}

@CommandHandler(EmailConfirmationCodeResendingCommand)
export class EmailConfirmationCodeResendingCommandHandler
  implements ICommandHandler<EmailConfirmationCodeResendingCommand, boolean>
{
  constructor(
    private userRepository: UserRepository,
    private userQueryRepository: UserQueryRepository,
    private emailManger: EmailManager,
  ) {}

  async execute(
    command: EmailConfirmationCodeResendingCommand,
  ): Promise<boolean> {
    const user = await this.userQueryRepository.getUserByIdOrLoginOrEmail(
      command.email,
    );
    const newEmailConfirmationCode = randomUUID();
    await this.userRepository.updateEmailConfirmationCode(
      user.id,
      newEmailConfirmationCode,
    );
    await this.emailManger.sendConfirmationEmail(
      command.email,
      newEmailConfirmationCode,
    );
    return true;
  }
}
