import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePairTokenCommand } from './update-pair-token.command';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { settings } from '../../../../shared/settings';
import { PairTokenResponse } from '../../../response';
import { UserRepository } from '../../../providers/user.repository';
import { UserQueryRepository } from '../../../providers/user.query.repository';
import { Device } from '../../../schema';

@CommandHandler(UpdatePairTokenCommand)
export class UpdatePairTokenCommandHandler
  implements ICommandHandler<UpdatePairTokenCommand, PairTokenResponse>
{
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userRepository: UserRepository,
    private userQueryRepository: UserQueryRepository,
  ) {}

  async execute(command: UpdatePairTokenCommand): Promise<PairTokenResponse> {
    const { userId, deviceId, ipAddress, title } = command.dto;
    const user = await this.userQueryRepository.getUserByIdOrLoginOrEmail(
      userId,
    );
    const [device] = user.devices.filter((d) => d.deviceId === deviceId);
    const ipIsDifferent = device.ipAddress !== ipAddress;
    const titleIsDifferent = device.title !== title;
    if (ipIsDifferent && titleIsDifferent) {
      const device = Device.create({ deviceId, ipAddress, title });
      await this.userRepository.createUserDevice(userId, device);
    }
    const [newAccessToken, newRefreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: userId,
          deviceId,
        },
        {
          secret: this.configService.get<string>('jwtAccessTokenSecret'),
          expiresIn: settings.timeLife.ACCESS_TOKEN,
        },
      ),
      this.jwtService.signAsync(
        {
          id: userId,
          deviceId,
        },
        {
          secret: this.configService.get<string>('jwtRefreshTokenSecret'),
          expiresIn: settings.timeLife.REFRESH_TOKEN,
        },
      ),
    ]);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}
