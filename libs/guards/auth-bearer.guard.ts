import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserQueryRepository } from '../users/providers/user.query.repository';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AuthBearerGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    protected queryUsersRepository: UserQueryRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    if (!req.headers.authorization) {
      throw new RpcException("No token provided in 'Authorization' header");
    }

    const accessToken = req.headers.authorization.split(' ')[1];
    const tokenPayload = await this.jwtService.verify(accessToken);
    if (!tokenPayload) {
      throw new RpcException('Wrong token');
    }

    const userExist = await this.queryUsersRepository.userExists(
      tokenPayload.userId,
    );

    if (!userExist) {
      throw new RpcException("User doesn't exist");
    }

    req.userId = tokenPayload.userId;
    req.token = tokenPayload;
    return true;
  }
}
