import { LoginDto } from '../../../../../apps/auth/dto';
import { WithClientMeta } from '../../../dto';

export class LoginUserCommand {
  constructor(public readonly dto: WithClientMeta<LoginDto>) {}
}
