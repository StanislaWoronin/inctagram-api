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

  async execute({ dto }: LogoutCommand) {
    const { userId, deviceId } = dto;
    const user = await this.userQueryRepository.getUserByIdOrLoginOrEmail(
      userId,
    );
    const newDevices = user.devices.filter(d => {
      if (d.deviceId !== deviceId) return d
    });

    return await this.userRepository.removeDeviceId(userId, newDevices);
  }
}
