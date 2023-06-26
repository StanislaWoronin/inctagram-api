import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserQueryRepository } from '../users/providers/user.query.repository';
import { TTokenPayload } from '../shared';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class RefreshTokenValidationGuard implements CanActivate {
  constructor(
    protected jwtService: JwtService,
    protected queryUsersRepository: UserQueryRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    if (!req.cookies.refreshToken) {
      throw new RpcException('Unauthorized');
    }

    // @ts-ignore
    const tokenPayload: TTokenPayload = await this.jwtService.decode(
      req.cookies.refreshToken,
    );
    if (!tokenPayload) {
      console.log('Токен не рассекретился');
      throw new RpcException('Wrong token');
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
      throw new RpcException("User doesn't exist");
    }

    req.userId = tokenPayload.id;
    req.deviceId = tokenPayload.deviceId;
    return true;
  }
}
