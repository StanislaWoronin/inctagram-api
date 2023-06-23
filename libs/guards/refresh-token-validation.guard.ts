import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserQueryRepository } from '../users/providers/user.query.repository';

@Injectable()
export class RefreshTokenValidationGuard implements CanActivate {
  constructor(
    protected jwtService: JwtService,
    protected queryUsersRepository: UserQueryRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    if (!req.cookies.refreshToken) {
      // console.log('Отсутствует токен в req.cookies.refreshToken')
      throw new UnauthorizedException();
    }

    const tokenPayload: any = await this.jwtService.decode(
      req.cookies.refreshToken,
    );

    if (!tokenPayload) {
      // console.log('Токен не рассекретился')
      throw new UnauthorizedException();
    }

    const user = await this.queryUsersRepository.getUserByIdOrLoginOrEmail(
      tokenPayload.userId,
    );
    const device = user.devices.filter(d => d.deviceId === tokenPayload.deviceId)

    if (!device) {
      // console.log('Пользовотель не нашелся')
      throw new UnauthorizedException();
    }

    req.userId = tokenPayload.userId;
    req.deviceId = tokenPayload.deviceId;
    return true;
  }
}
