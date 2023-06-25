import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserQueryRepository } from '../users/providers/user.query.repository';
import { TTokenPayload } from '../shared';
import { log } from 'util';

@Injectable()
export class RefreshTokenValidationGuard implements CanActivate {
  constructor(
    protected jwtService: JwtService,
    protected queryUsersRepository: UserQueryRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    if (!req.cookies.refreshToken) {
      console.log('Отсутствует токен в req.cookies.refreshToken');
      throw new UnauthorizedException();
    }

    // @ts-ignore
    const tokenPayload: TTokenPayload = await this.jwtService.decode(
      req.cookies.refreshToken,
    );
    if (!tokenPayload) {
      console.log('Токен не рассекретился');
      throw new UnauthorizedException();
    }
    console.log(tokenPayload.id);
    const user = await this.queryUsersRepository.getUserByField(
      tokenPayload.id,
    );
    console.log(user);
    const device = user.devices.filter(
      (d) => d.deviceId === tokenPayload.deviceId,
    );
    console.log(device);
    if (!device) {
      console.log('Пользовотель не нашелся');
      throw new UnauthorizedException();
    }

    req.userId = tokenPayload.id;
    req.deviceId = tokenPayload.deviceId;
    return true;
  }
}
