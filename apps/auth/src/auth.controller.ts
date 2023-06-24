import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { SessionIdDto, WithClientMeta } from '../../../libs/users/dto';
import { Commands } from '../../../libs/shared';
import { UserFacade } from '../../../libs/users/application-services';
import { PairTokenResponse, ViewUser } from '../../../libs/users/response';
import { LoginDto } from '../dto/login.dto';
import { RegistrationDto } from '../dto/registration.dto';
import { EmailDto, TEmail } from '../dto/email.dto';
import { RegistrationConfirmationDto } from '../dto/registration-confirmation.dto';
import { NewPasswordDto } from '../dto';

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

  @MessagePattern({ cmd: Commands.EmailConfirmationResending })
  async emailConfirmationResending(dto: EmailDto) {
    return await this.userFacade.commands.emailConfirmationResending(dto.email);
  }

  @MessagePattern({ cmd: Commands.PasswordRecovery })
  async passwordRecovery(dto: EmailDto) {
    return await this.userFacade.commands.passwordRecovery(dto.email);
  }

  @MessagePattern({ cmd: Commands.PasswordRecovery })
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
