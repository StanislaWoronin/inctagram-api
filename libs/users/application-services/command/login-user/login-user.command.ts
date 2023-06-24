import { LoginDto, WithClientMeta } from '../../../../../apps/auth/dto';

export class LoginUserCommand {
  constructor(public readonly dto: WithClientMeta<LoginDto>) {}
}
