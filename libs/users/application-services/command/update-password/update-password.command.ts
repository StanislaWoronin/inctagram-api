import { UpdatePasswordDto } from '../../../dto';

export class UpdatePasswordCommand {
  constructor(public readonly dto: UpdatePasswordDto) {}
}
