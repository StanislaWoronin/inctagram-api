import { RegistrationDto } from '../../../dto';

export class CreateUserCommand {
  constructor(public readonly dto: RegistrationDto) {}
}
