import {BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {TTokenPayload} from '../shared';
import {RpcException} from '@nestjs/microservices';

@Injectable()
export class RefreshTokenValidationGuard implements CanActivate {
  constructor(
    protected jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    // @ts-ignore
    const tokenPayload: TTokenPayload = await this.jwtService.decode(
      req.cookies.refreshToken,
    );

    if (!tokenPayload) {
      throw new RpcException(new UnauthorizedException());
    }

    if (tokenPayload.exp * 1000 < Date.now()) {
      throw new RpcException(new UnauthorizedException());
    }

    req.userId = tokenPayload.id;
    req.deviceId = tokenPayload.deviceId;
    return true;
  }
}
