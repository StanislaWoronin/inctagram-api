import { LoginDto } from '../../../../../apps/auth/dto/login.dto';

export class LoginUserCommand {
  constructor(public readonly data: LoginDto) {}
}
