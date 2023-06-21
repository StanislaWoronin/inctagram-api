import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RegistrationDto } from '../../../libs/users/dto';
import { Commands } from '../../../libs/shared';
import { UserFacade } from '../../../libs/users/application-services';
import { RegistrationResponse } from '../../../libs/users/response';

@Controller()
export class AuthController {
  constructor(private readonly userFacade: UserFacade) {}

  @MessagePattern({ cmd: Commands.Registration })
  async registration(data: RegistrationDto): Promise<RegistrationResponse> {
    return await this.userFacade.commands.registrationUser(data);
  }
}
