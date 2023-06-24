import { SessionIdDto } from '../../../../../apps/auth/dto';

export class LogoutCommand {
  constructor(public readonly dto: SessionIdDto) {}
}
