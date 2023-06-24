import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePasswordCommand } from './update-password.command';
import { UserRepository } from '../../../providers/user.repository';
import { UserQueryRepository } from '../../../providers/user.query.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
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
    const { userId, newPassword, passwordRecoveryCode } = dto;
    const user = await this.userQueryRepository.getUserByIdOrLoginOrEmail(
      userId,
    );
    if (!user) throw new NotFoundException();

    const isDifferent = user.passwordRecoveryCode !== passwordRecoveryCode;
    const isExpired = passwordRecoveryCode < Date.now();
    if (isDifferent || isExpired)
      throw new BadRequestException(
        'The time to update the' +
          ' password has expired. Request a new verification code.',
      );

    const hash = await bcrypt.hash(user.password, 10);
    if ((user.passwordHash = hash))
      throw new BadRequestException('New password to equal old.');
    const newHash = await bcrypt.hash(newPassword, 10);

    return await this.userRepository.updateUserPassword(userId, newHash);
  }
}
