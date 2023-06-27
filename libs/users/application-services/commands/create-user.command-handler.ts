import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../providers/user.repository';
import { UserAggregate } from '../../schema';
import { ViewUser } from '../../response';
import { EmailManager } from '../../../adapters/email.adapter';
import { TRegistration } from '../../../../apps/auth/dto';
import { RpcException } from '@nestjs/microservices';
import { UserQueryRepository } from '../../providers/user.query.repository';

export class CreateUserCommand {
  constructor(public readonly dto: TRegistration) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand, ViewUser>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userQueryRepository: UserQueryRepository,
    private readonly emailManager: EmailManager,
  ) {}

  async execute(command: CreateUserCommand): Promise<ViewUser> {
    const user = await this.userQueryRepository.getUserByField(
      command.dto.email,
    );
    if (user) {
      await this.userRepository.deleteUser(user.id);
    }
    const newUser = await UserAggregate.create(command.dto);
    const createdUser = await this.userRepository.createUser(newUser);
    await this.emailManager.sendConfirmationEmail(
      createdUser.email,
      createdUser.emailConfirmation.confirmationCode,
    );

    return ViewUser.create(createdUser);
  }
}
