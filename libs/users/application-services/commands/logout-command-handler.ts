import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../providers/user.repository';
import { UserQueryRepository } from '../../providers/user.query.repository';
import { SessionIdDto } from '../../../../apps/auth/dto';

export class LogoutCommand {
  constructor(public readonly dto: SessionIdDto) {}
}

@CommandHandler(LogoutCommand)
export class LogoutCommandHandler implements ICommandHandler<LogoutCommand> {
  constructor(
    private userRepository: UserRepository,
    private userQueryRepository: UserQueryRepository,
  ) {}

  async execute(command: LogoutCommand) {
    const { userId, deviceId } = command.dto;
    const user = await this.userQueryRepository.getUserByField(userId);
    return await this.userRepository.removeDeviceId(userId, deviceId);
  }
}
