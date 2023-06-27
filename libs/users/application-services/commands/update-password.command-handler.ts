import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../providers/user.repository';
import { UserQueryRepository } from '../../providers/user.query.repository';
import bcrypt from 'bcrypt';
import { NewPasswordDto } from '../../../../apps/auth/dto';
import { RpcException } from '@nestjs/microservices';
import { BadRequestException } from '@nestjs/common';

export class UpdatePasswordCommand {
  constructor(public readonly dto: NewPasswordDto) {}
}

@CommandHandler(UpdatePasswordCommand)
export class UpdatePasswordCommandHandler
  implements ICommandHandler<UpdatePasswordCommand>
{
  constructor(
    private userRepository: UserRepository,
    private userQueryRepository: UserQueryRepository,
  ) {}

  async execute({ dto }: UpdatePasswordCommand) {
    const { newPassword, passwordRecoveryCode } = dto;

    const user =
      await this.userQueryRepository.getUserByFieldPasswordRecoveryCode(
        passwordRecoveryCode,
      );

    const passwordEqual = await bcrypt.compare(newPassword, user.passwordHash);
    if (passwordEqual) {
      throw new RpcException(
        new BadRequestException('newPassword:New password to equal old.'),
      );
    }

    const hash = await bcrypt.hash(newPassword, 10);
    return await this.userRepository.updateUserPassword(user.id, hash);
  }
}
