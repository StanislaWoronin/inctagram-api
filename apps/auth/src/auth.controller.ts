import { Controller } from '@nestjs/common';
import { Commands } from '../../../libs/shared';
import { UserFacade } from '../../../libs/users/application-services';
import { PairTokenResponse, ViewUser } from '../../../libs/users/response';
import { LoginDto } from '../dto';
import {
  EmailDto,
  NewPasswordDto,
  RegistrationConfirmationDto,
  RegistrationDto,
  SessionIdDto,
  WithClientMeta,
} from '../dto';
import { TestingRepository } from './testing.repository';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(
    private readonly userFacade: UserFacade,
    private readonly testingRepository: TestingRepository,
  ) {}

  @MessagePattern({ cmd: Commands.Registration })
  async registration(data: RegistrationDto): Promise<ViewUser> {
    return await this.userFacade.commands.registrationUser(data);
  }

  @MessagePattern({ cmd: Commands.Login })
  async login(data: WithClientMeta<LoginDto>): Promise<PairTokenResponse> {
    return await this.userFacade.commands.loginUser(data);
  }

  @MessagePattern({ cmd: Commands.ConfirmationCodeResending })
  async confirmationCodeResending(dto: EmailDto): Promise<boolean> {
    return await this.userFacade.commands.confirmationCodeResending(dto);
  }

  @MessagePattern({ cmd: Commands.RegistrationConfirmation })
  async registrationConfirmation(
    dto: RegistrationConfirmationDto,
  ): Promise<boolean> {
    return await this.userFacade.commands.registrationConfirmation(dto);
  }

  @MessagePattern({ cmd: Commands.PasswordRecovery })
  async passwordRecovery(dto: EmailDto): Promise<boolean> {
    return await this.userFacade.commands.passwordRecovery(dto);
  }

  @MessagePattern({ cmd: Commands.UpdatePassword })
  async updatePassword(dto: NewPasswordDto): Promise<boolean> {
    return await this.userFacade.commands.updatePassword(dto);
  }

  @MessagePattern({ cmd: Commands.UpdatePairToken })
  async updatePairToken(
    dto: WithClientMeta<SessionIdDto>,
  ): Promise<PairTokenResponse> {
    return await this.userFacade.commands.updatePairToken(dto);
  }

  @MessagePattern({ cmd: Commands.Logout })
  async logout(dto: SessionIdDto): Promise<boolean> {
    return this.userFacade.commands.logout(dto);
  }

  @MessagePattern({ cmd: Commands.DeleteAll })
  async deleteAll({}): Promise<boolean> {
    return this.testingRepository.deleteAll();
  }

  @MessagePattern({ cmd: Commands.GetUser })
  async getUser({ data }) {
    return this.testingRepository.getUser(data);
  }
}
