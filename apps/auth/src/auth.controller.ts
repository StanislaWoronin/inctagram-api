import {Controller} from '@nestjs/common';
import {MessagePattern} from '@nestjs/microservices';
import {RegistrationDto, SessionIdDto, UpdatePasswordDto, WithClientMeta,} from '../../../libs/users/dto';
import {Commands} from '../../../libs/shared';
import {UserFacade} from '../../../libs/users/application-services';
import {LoginDto} from '../dto/login.dto';
import {PairTokenResponse} from '../../../libs/users/response/pair-token.response';
import { ViewUser } from '../../../libs/users/response';

@Controller()
export class AuthController {
  constructor(private readonly userFacade: UserFacade) {}

  @MessagePattern({ cmd: Commands.Registration })
  async registration(data: RegistrationDto): Promise<ViewUser> {
    // @ts-ignore
    return await this.userFacade.commands.registrationUser(data);
  }

  @MessagePattern({ cmd: Commands.Login })
  async login(
    dto: WithClientMeta<LoginDto>,
  ): Promise<PairTokenResponse> {
    // @ts-ignore
    return await this.userFacade.commands.loginUser(dto);
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
    dto: WithClientMeta<SessionIdDto>,
  ): Promise<PairTokenResponse> {
    // @ts-ignore
    return await this.userFacade.commands.updatePairToken(dto);
  }

  @MessagePattern({ cmd: Commands.Logout })
  async logout(dto: SessionIdDto) {
    return this.userFacade.commands.logout(dto);
  }
}
