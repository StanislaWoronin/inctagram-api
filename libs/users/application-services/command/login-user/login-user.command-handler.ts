import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginUserCommand } from './login-user.command';
import { UserQueryRepository } from '../../../providers/user.query.repository';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';

@CommandHandler(LoginUserCommand)
export class LoginUserCommandHandler
  implements ICommandHandler<LoginUserCommand, string[]>
{
  constructor(
    private userQueryRepository: UserQueryRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async execute({ data }: LoginUserCommand): Promise<string[]> {
    const user = await this.userQueryRepository.getUserByLoginOrEmail(
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

    const [newAccessToken, newRefreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: user.id,
        },
        {
          secret: this.configService.get<string>('jwtAccessTokenSecret'),
          expiresIn: '30 minutes',
        },
      ),
      this.jwtService.signAsync(
        {
          id: user.id,
        },
        {
          secret: this.configService.get<string>('jwtRefreshTokenSecret'),
          expiresIn: '5 days',
        },
      ),
    ]);

    return [newAccessToken, newRefreshToken];
  }
}
