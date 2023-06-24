import { TRegistration } from '../../../../../apps/auth/dto';

export class CreateUserCommand {
  constructor(public readonly dto: TRegistration) {}
}
