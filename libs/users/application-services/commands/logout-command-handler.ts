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

  async execute({ dto }: LogoutCommand) {
    const { userId, deviceId } = dto;
    const user = await this.userQueryRepository.getUserByField(userId);
    user.devices = user.devices.filter((d) => d.deviceId !== deviceId);

    return await this.userRepository.removeDeviceId(user);
  }
}
