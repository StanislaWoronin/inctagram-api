import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserQueryRepository } from '../users/providers/user.query.repository';

@Injectable()
export class AuthBearerGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    protected queryUsersRepository: UserQueryRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    if (!req.headers.authorization) {
      throw new UnauthorizedException();
    }

    const accessToken = req.headers.authorization.split(' ')[1];
    const tokenPayload = await this.jwtService.verify(accessToken);
    if (!tokenPayload) {
      throw new UnauthorizedException();
    }

    const userExist = await this.queryUsersRepository.userExists(
      tokenPayload.userId,
    );

    if (!userExist) {
      throw new UnauthorizedException();
    }

    req.userId = tokenPayload.userId;
    req.token = tokenPayload;
    return true;
  }
}
