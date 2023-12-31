import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PairTokenResponse } from '../../response';
import { UserRepository } from '../../providers/user.repository';
import { UserQueryRepository } from '../../providers/user.query.repository';
import { Device } from '../../schema';
import { SessionIdDto, WithClientMeta } from '../../../../apps/auth/dto';
import { RpcException } from '@nestjs/microservices';
import { Factory } from '../../../shared/tokens.factory';

export class UpdatePairTokenCommand {
  constructor(public readonly dto: WithClientMeta<SessionIdDto>) {}
}

@CommandHandler(UpdatePairTokenCommand)
export class UpdatePairTokenCommandHandler
  implements ICommandHandler<UpdatePairTokenCommand, PairTokenResponse>
{
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userRepository: UserRepository,
    private userQueryRepository: UserQueryRepository,
    private factory: Factory,
  ) {}

  async execute({ dto }: UpdatePairTokenCommand): Promise<PairTokenResponse> {
    const { userId, deviceId, ipAddress, title } = dto;
    const user = await this.userQueryRepository.getUserByField(userId);
    if (!user) throw new RpcException('Wrong token'); // Protection against intruders

    const [device] = user.devices.filter((d) => d.deviceId === deviceId);
    if (!device) throw new RpcException('Wrong token'); // Protection against intruders

    const ipIsDifferent = device.ipAddress !== ipAddress;
    const titleIsDifferent = device.title !== title;
    if (ipIsDifferent && titleIsDifferent) {
      const device = Device.create({ ipAddress, title });
      await this.userRepository.createUserDevice(userId, device);
    }

    return await this.factory.getPairTokens(user.id, device.deviceId);
  }
}
