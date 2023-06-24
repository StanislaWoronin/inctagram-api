import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Commands } from '../../../libs/shared';
import { UserFacade } from '../../../libs/users/application-services';
import { PairTokenResponse, ViewUser } from '../../../libs/users/response';
import { LoginDto } from '../dto/login.dto';
import {
  NewPasswordDto,
  RegistrationDto,
  SessionIdDto,
  WithClientMeta,
} from '../dto';

@Controller()
export class AuthController {
  constructor(private readonly userFacade: UserFacade) {}

  @MessagePattern({ cmd: Commands.Registration })
  async registration(data: RegistrationDto): Promise<ViewUser> {
    return await this.userFacade.commands.registrationUser(data);
  }

  @MessagePattern({ cmd: Commands.Login })
  async login(data: WithClientMeta<LoginDto>): Promise<PairTokenResponse> {
    return await this.userFacade.commands.loginUser(data);
  }

  @MessagePattern({ cmd: Commands.ConfirmationCodeResending })
  async confirmationCodeResending(email: string) {
    return await this.userFacade.commands.confirmationCodeResending(email);
  }

  @MessagePattern({ cmd: Commands.RegistrationConfirmation })
  async registrationConfirmation(email: string) {
    return await this.userFacade.commands.registrationConfirmation(email);
  }

  @MessagePattern({ cmd: Commands.PasswordRecovery })
  async passwordRecovery(email: string) {
    return await this.userFacade.commands.passwordRecovery(email);
  }

  @MessagePattern({ cmd: Commands.UpdatePassword })
  async updatePassword(dto: NewPasswordDto) {
    return await this.userFacade.commands.updatePassword(dto);
  }

  @MessagePattern({ cmd: Commands.UpdatePairToken })
  async updatePairToken(
    data: WithClientMeta<SessionIdDto>,
  ): Promise<PairTokenResponse> {
    return await this.userFacade.commands.updatePairToken(data);
  }

  @MessagePattern({ cmd: Commands.Logout })
  async logout(dto: SessionIdDto) {
    return this.userFacade.commands.logout(dto);
  }
}
