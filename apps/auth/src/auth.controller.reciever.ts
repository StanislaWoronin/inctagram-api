import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RegistrationDto, SessionIdDto } from '../../../libs/users/dto';
import { Commands } from '../../../libs/shared';
import { UserFacade } from '../../../libs/users/application-services';
import { LoginDto } from '../dto/login.dto';
import { PairTokenResponse } from '../../../libs/users/response/pair-token.response';
import { UpdatePairTokenCommand } from '../../../libs/users/application-services/command/update-pair-token';
import { LoginUserCommand } from '../../../libs/users/application-services/command';

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
  async login(
    data: LoginDto,
  ): Promise<({ data }: LoginUserCommand) => Promise<PairTokenResponse>> {
    return await this.userFacade.commands.loginUser(data);
  }

  @MessagePattern({ cmd: Commands.PasswordRecovery })
  async passwordRecovery(email: string) {
    return await this.userFacade.commands.passwordRecovery(email);
  }

  @MessagePattern({ cmd: Commands.UpdatePairToken })
  async updatePairToken(
    data: SessionIdDto,
  ): Promise<({ data }: UpdatePairTokenCommand) => Promise<PairTokenResponse>> {
    return await this.userFacade.commands.updatePairToken(data);
  }

  @MessagePattern({ cmd: Commands.Logout })
  async logout(userId: string) {
    return this.userFacade.commands.logout(userId);
  }
}
