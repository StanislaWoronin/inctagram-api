import { SessionIdDto } from '../../../dto';

export class LogoutCommand {
  constructor(public readonly userId: string) {}
}
