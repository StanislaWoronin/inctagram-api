import { SessionIdDto, WithClientMeta } from '../../../dto';

export class UpdatePairTokenCommand {
  constructor(public readonly dto: WithClientMeta<SessionIdDto>) {}
}
