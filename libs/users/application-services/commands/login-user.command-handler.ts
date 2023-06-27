import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserQueryRepository } from '../../providers/user.query.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';
import { settings } from '../../../shared/settings';
import { PairTokenResponse } from '../../response';
import { UserRepository } from '../../providers/user.repository';
import { Device } from '../../schema';
import { LoginDto, WithClientMeta } from '../../../../apps/auth/dto';
import { RpcException } from '@nestjs/microservices';
import { Factory } from '../../../shared/tokens.factory';
import {UnauthorizedException} from "@nestjs/common";

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
    private factory: Factory,
  ) {}

  async execute({ dto }: LoginUserCommand): Promise<PairTokenResponse> {
    const { email, password, ipAddress, title } = dto;

    const user = await this.userQueryRepository.getUserByField(email);
    if (!user) {
      throw new RpcException(new UnauthorizedException())
    }
    if (!user.emailConfirmation.isConfirmed) {
      throw new RpcException(new UnauthorizedException())
    }
    const passwordEqual = await bcrypt.compare(password, user.passwordHash);
    if (!passwordEqual) {
      throw new RpcException(new UnauthorizedException())
    }

    const device = Device.create({ ipAddress, title });
    await this.userRepository.createUserDevice(user.id, device);

    return await this.factory.getPairTokens(user.id, device.deviceId);
  }
}
