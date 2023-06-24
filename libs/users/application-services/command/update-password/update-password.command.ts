import { NewPasswordDto } from '../../../../../apps/auth/dto';

export class UpdatePasswordCommand {
  constructor(public readonly dto: NewPasswordDto) {}
}
