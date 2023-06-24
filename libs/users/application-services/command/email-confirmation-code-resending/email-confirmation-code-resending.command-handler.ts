import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmailConfirmationCodeResendingCommand } from './email-confirmation-code-resending.command';
import { UserQueryRepository } from '../../../providers/user.query.repository';
import { UserRepository } from '../../../providers/user.repository';
import { EmailManager } from '../../../../adapters/email.adapter';
import { BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';

@CommandHandler(EmailConfirmationCodeResendingCommand)
export class EmailConfirmationCodeResendingCommandHandler
  implements ICommandHandler<EmailConfirmationCodeResendingCommand>
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
    if (user.emailConfirmation.isConfirmed) {
      throw new BadRequestException('Email is already confirmed');
    }
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
