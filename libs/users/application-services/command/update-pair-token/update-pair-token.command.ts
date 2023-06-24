import { SessionIdDto, WithClientMeta } from '../../../../../apps/auth/dto';

export class UpdatePairTokenCommand {
  constructor(public readonly dto: WithClientMeta<SessionIdDto>) {}
}
