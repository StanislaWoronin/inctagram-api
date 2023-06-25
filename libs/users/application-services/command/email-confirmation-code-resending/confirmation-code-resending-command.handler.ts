import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserQueryRepository } from '../../../providers/user.query.repository';
import { UserRepository } from '../../../providers/user.repository';
import { EmailManager } from '../../../../adapters/email.adapter';
import { randomUUID } from 'crypto';

export class ConfirmationCodeResendingCommand {
  constructor(public readonly email: string) {}
}

@CommandHandler(ConfirmationCodeResendingCommand)
export class ConfirmationCodeResendingCommandHandler
  implements ICommandHandler<ConfirmationCodeResendingCommand, boolean>
{
  constructor(
    private userRepository: UserRepository,
    private userQueryRepository: UserQueryRepository,
    private emailManger: EmailManager,
  ) {}

  async execute(command: ConfirmationCodeResendingCommand): Promise<boolean> {
    console.log('handler');
    const user = await this.userQueryRepository.getUserByField(command.email);
    console.log(user);
    const newEmailConfirmationCode = randomUUID();
    await this.userRepository.updateEmailConfirmationCode(
      user.id,
      newEmailConfirmationCode,
    );
    console.log('after update');
    await this.emailManger.sendConfirmationEmail(
      command.email,
      newEmailConfirmationCode,
    );
    return true;
  }
}
