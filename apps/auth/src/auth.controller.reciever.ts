import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RegistrationDto, SessionIdDto } from '../../../libs/users/dto';
import { Commands } from '../../../libs/shared';
import { UserFacade } from '../../../libs/users/application-services';
import { RegistrationResponse } from '../../../libs/users/response';
import { LoginDto } from '../dto/login.dto';
import { LoginResponse } from '../../../libs/users/response/login.response';
import { PairTokenResponse } from '../../../libs/users/response/pair-token.response';

@Controller()
export class AuthController {
  constructor(private readonly userFacade: UserFacade) {}

  @MessagePattern({ cmd: Commands.Registration })
  async registration(data: RegistrationDto) {
    console.log('auth');
    const res = await this.userFacade.commands.registrationUser(data);
    console.log({ res });
    return res;
  }

  @MessagePattern({ cmd: Commands.Login })
  async login(data: LoginDto): Promise<LoginResponse> {
    return await this.userFacade.commands.loginUser(data);
  }

  @MessagePattern({ cmd: Commands.UpdatePairToken })
  async updatePairToken(data: SessionIdDto): Promise<PairTokenResponse> {
    // @ts-ignore // TODO
    return await this.userFacade.commands.updatePairToken(data);
  }

  @MessagePattern({ cmd: Commands.Logout })
  async logout(userId: string) {
    return this.userFacade.commands.logout(userId);
  }
}
