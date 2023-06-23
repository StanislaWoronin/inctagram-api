import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LogoutCommand } from './logout.command';
import { UserRepository } from '../../../providers/user.repository';

@CommandHandler(LogoutCommand)
export class LogoutCommandHandler implements ICommandHandler<LogoutCommand> {
  constructor(private userRepository: UserRepository) {}

  async execute({ userId }: LogoutCommand) {
    return await this.userRepository.removeDeviceId(userId);
  }
}
