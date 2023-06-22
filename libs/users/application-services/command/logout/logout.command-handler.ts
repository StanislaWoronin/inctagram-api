import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LogoutCommand } from './logout.command';
import { UserQueryRepository } from '../../../providers/user.query.repository';

@CommandHandler(LogoutCommand)
export class LogoutCommandHandler implements ICommandHandler<LogoutCommand> {
  constructor(private userQueryRepository: UserQueryRepository) {}

  async execute({ userId }: LogoutCommand) {
    return await this.userQueryRepository.removeDeviceId(userId);
  }
}
