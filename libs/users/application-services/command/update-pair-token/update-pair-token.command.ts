import { SessionIdDto } from '../../../dto';

export class UpdatePairTokenCommand {
  constructor(public readonly data: SessionIdDto) {}
}
