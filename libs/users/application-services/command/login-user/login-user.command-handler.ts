import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginUserCommand } from './login-user.command';
import { UserQueryRepository } from '../../../providers/user.query.repository';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';
import { settings } from '../../../../shared/settings';
import { PairTokenResponse } from '../../../response/pair-token.response';
import { randomUUID } from 'crypto';
import { UserRepository } from '../../../providers/user.repository';

@CommandHandler(LoginUserCommand)
export class LoginUserCommandHandler
  implements ICommandHandler<LoginUserCommand, PairTokenResponse>
{
  constructor(
    private userQueryRepository: UserQueryRepository,
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async execute({ data }: LoginUserCommand): Promise<PairTokenResponse> {
    const user = await this.userQueryRepository.getUserByIdOrLoginOrEmail(
      data.loginOrEmail,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    const passwordEqual = await bcrypt.compare(
      data.password,
      user.passwordHash,
    );

    if (!passwordEqual) {
      throw new UnauthorizedException();
    }

    const deviceId = randomUUID();

    await this.userRepository.createUserDeviceId({ userId: user.id, deviceId });

    const [newAccessToken, newRefreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: user.id,
          deviceId: deviceId,
          lastActiveDate: new Date(),
        },
        {
          secret: this.configService.get<string>('jwtAccessTokenSecret'),
          expiresIn: settings.timeLife.ACCESS_TOKEN,
        },
      ),
      this.jwtService.signAsync(
        {
          id: user.id,
          deviceId: deviceId,
          lastActiveDate: new Date(),
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
