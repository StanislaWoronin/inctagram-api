import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePasswordCommand } from './update-password.command';
import { UserRepository } from '../../../providers/user.repository';
import { UserQueryRepository } from '../../../providers/user.query.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { settings } from '../../../../shared/settings';
import bcrypt from 'bcrypt';

@CommandHandler(UpdatePasswordCommand)
export class UpdatePasswordCommandHandler
  implements ICommandHandler<UpdatePasswordCommand>
{
  constructor(
    private userRepository: UserRepository,
    private userQueryRepository: UserQueryRepository,
  ) {}

  async execute({ dto }: UpdatePasswordCommand) {
    const { userId, newPassword, recoveryCode } = dto;
    const user = await this.userQueryRepository.getUserByLoginOrEmail(userId);
    if (!user) throw new NotFoundException();
    if (
      user.passwordRecovery !== recoveryCode ||
      recoveryCode - settings.timeLife.PASSWORD_RECOVERY_CODE > Date.now()
    )
      throw new BadRequestException(
        'The time to update the' +
          ' password has expired. Request a new verification code.',
      );

    const salt = await bcrypt.genSalt(Number(settings.SALT_GENERATE_ROUND));
    const hash = await bcrypt.hash(newPassword, salt);
    if ((user.passwordHash = hash))
      throw new BadRequestException('New password to equal old.');

    return await this.userRepository.updateUserPassword(userId, hash);
  }
}
