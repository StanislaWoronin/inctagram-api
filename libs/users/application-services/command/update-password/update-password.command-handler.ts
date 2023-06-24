import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../../providers/user.repository';
import { UserQueryRepository } from '../../../providers/user.query.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { NewPasswordDto } from '../../../../../apps/auth/dto';

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
    const { newPassword, passwordConfirmation, passwordRecoveryCode } = dto;

    const user =
      await this.userQueryRepository.getUserByFiePasswordRecoveryCode(
        passwordRecoveryCode,
      );

    const isDifferent = user.passwordRecoveryCode !== passwordRecoveryCode;
    const isExpired = passwordRecoveryCode < Date.now();
    if (isDifferent || isExpired)
      throw new BadRequestException(
        'The time to update the' +
          ' password has expired. Request a new verification code.',
      );

    const hash = await bcrypt.hash(newPassword, 10);
    if (user.passwordHash === hash)
      throw new BadRequestException('New password to equal old.');

    return await this.userRepository.updateUserPassword(user.id, hash);
  }
}
