import { LoginDto } from '../../../../../apps/auth/dto/login.dto';
import { WithClientMeta } from '../../../dto';

export class LoginUserCommand {
  constructor(public readonly dto: WithClientMeta<LoginDto>) {}
}
