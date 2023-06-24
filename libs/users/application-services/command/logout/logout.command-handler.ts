import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LogoutCommand } from './logout.command';
import { UserRepository } from '../../../providers/user.repository';
import { UserQueryRepository } from '../../../providers/user.query.repository';

@CommandHandler(LogoutCommand)
export class LogoutCommandHandler implements ICommandHandler<LogoutCommand> {
  constructor(
    private userRepository: UserRepository,
    private userQueryRepository: UserQueryRepository,
  ) {}

  async execute(command: LogoutCommand) {
    const { userId, deviceId } = command.dto;
    const user = await this.userQueryRepository.getUserByIdOrLoginOrEmail(
      userId,
    );
    return await this.userRepository.removeDeviceId(userId, deviceId);
  }
}
