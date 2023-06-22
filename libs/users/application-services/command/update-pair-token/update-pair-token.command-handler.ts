import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePairTokenCommand } from './update-pair-token.command';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { settings } from '../../../../shared/settings';
import { PairTokenResponse } from '../../../response/pair-token.response';

@CommandHandler(UpdatePairTokenCommand)
export class UpdatePairTokenCommandHandler
  implements ICommandHandler<UpdatePairTokenCommand, PairTokenResponse>
{
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async execute({ data }: UpdatePairTokenCommand): Promise<PairTokenResponse> {
    const { userId, deviceId } = data;
    const [newAccessToken, newRefreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: userId,
          deviceId: deviceId,
        },
        {
          secret: this.configService.get<string>('jwtAccessTokenSecret'),
          expiresIn: settings.timeLife.ACCESS_TOKEN,
        },
      ),
      this.jwtService.signAsync(
        {
          id: userId,
          deviceId: deviceId,
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
