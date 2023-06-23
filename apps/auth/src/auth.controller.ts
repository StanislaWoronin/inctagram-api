import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  RegistrationDto,
  SessionIdDto,
  UpdatePasswordDto,
} from '../../../libs/users/dto';
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
    return await this.userFacade.commands.registrationUser(data);
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

  @MessagePattern({ cmd: Commands.PasswordRecovery })
  async updatePassword(dto: UpdatePasswordDto) {
    return await this.userFacade.commands.updatePassword(dto);
  }

  @MessagePattern({ cmd: Commands.UpdatePairToken })
  async updatePairToken(
    data: SessionIdDto,
  ): Promise<({ data }: UpdatePairTokenCommand) => Promise<PairTokenResponse>> {
    return await this.userFacade.commands.updatePairToken(data);
  }

  @MessagePattern({ cmd: Commands.Logout })
  async logout(dto: SessionIdDto) {
    return this.userFacade.commands.logout(dto);
  }
}
