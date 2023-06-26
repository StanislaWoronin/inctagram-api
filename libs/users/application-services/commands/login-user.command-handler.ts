import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserQueryRepository } from '../../providers/user.query.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';
import { settings } from '../../../shared/settings';
import { PairTokenResponse } from '../../response';
import { UserRepository } from '../../providers/user.repository';
import { Device } from '../../schema';
import { randomUUID } from 'crypto';
import { LoginDto, WithClientMeta } from '../../../../apps/auth/dto';
import { RpcException } from '@nestjs/microservices';

export class LoginUserCommand {
  constructor(public readonly dto: WithClientMeta<LoginDto>) {}
}

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

  async execute(command: LoginUserCommand): Promise<PairTokenResponse> {
    const { email, password, ipAddress, title } = command.dto;
    const user = await this.userQueryRepository.getUserByField(email);
    console.log(user);
    if (!user) {
      throw new RpcException('Unauthorized');
    }
    if (!user.emailConfirmation.isConfirmed) {
      throw new RpcException('Unauthorized');
    }
    const passwordEqual = await bcrypt.compare(password, user.passwordHash);
    if (!passwordEqual) {
      throw new RpcException('Unauthorized');
    }

    const deviceId = randomUUID();
    const device = Device.create({ deviceId, ipAddress, title });
    await this.userRepository.createUserDevice(user.id, device);

    const [newAccessToken, newRefreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: user.id,
          deviceId: device.deviceId,
          lastActiveDate: new Date(),
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
          expiresIn: settings.timeLife.ACCESS_TOKEN,
        },
      ),
      this.jwtService.signAsync(
        {
          id: user.id,
          deviceId: device.deviceId,
          lastActiveDate: new Date(),
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
          expiresIn: settings.timeLife.REFRESH_TOKEN,
        },
      ),
    ]);
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}
