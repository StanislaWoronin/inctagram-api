import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Commands, Microservices } from '../../../libs/shared';
import { ClientProxy } from '@nestjs/microservices';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import {
  ApiLogin,
  ApiLogout,
  ApiNewPassword,
  ApiPasswordRecovery,
  ApiRefreshToken,
  ApiRegistration,
  ApiRegistrationConfirmation,
  ApiRegistrationEmailResending,
} from '../../../libs/documentation/auth.documentation';
import { RegistrationDto } from '../../auth/dto/registration.dto';
import { LoginDto } from '../../auth/dto/login.dto';
import { ResendingEmailConfirmationDto } from '../../auth/dto/resending-email-confirmation.dto';
import { RegistrationConfirmationDto } from '../../auth/dto/registration-confirmation.dto';
import { PasswordRecoveryDto } from '../../auth/dto/password-recovery.dto';
import { NewPasswordDto } from '../../auth/dto/new-password.dto';

@Controller()
@ApiTags('Auth')
export class AppGatewayController {
  constructor(
    @Inject(Microservices.Auth) private userProxyClient: ClientProxy,
  ) {}

  @ApiExcludeEndpoint()
  @Get()
  async mainEntry() {
    return 'Hello World';
  }

  @Post('auth/registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiRegistration()
  async registration(@Body() dto: RegistrationDto) {
    const pattern = { cmd: Commands.Registration };
    return this.userProxyClient.send(pattern, dto);
  }

  @Post('auth/login')
  @HttpCode(HttpStatus.OK)
  @ApiLogin()
  @UseGuards()
  async login(@Body() dto: LoginDto) {
    const pattern = { cmd: Commands.Login };
    return this.userProxyClient.send(pattern, dto);
  }

  @Post('auth/registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiRegistrationEmailResending()
  async registrationEmailResending(
    @Body() email: ResendingEmailConfirmationDto,
  ) {
    const pattern = { cmd: Commands.EmailResending };
    return this.userProxyClient.send(pattern, email);
  }

  @Post('auth/registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiRegistrationConfirmation()
  async registrationConfirmation(@Body() dto: RegistrationConfirmationDto) {
    const pattern = { cmd: Commands.RegistrationConfirmation };
    return this.userProxyClient.send(pattern, dto);
  }

  @Post('auth/password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiPasswordRecovery()
  async passwordRecovery(@Body() dto: PasswordRecoveryDto) {}

  @Post('auth/new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNewPassword()
  async createNewPassword(@Body() dto: NewPasswordDto) {}

  @Post('auth/refresh-token')
  @HttpCode(HttpStatus.OK)
  @UseGuards()
  @ApiRefreshToken()
  async createRefreshToken() {}

  @Post('auth/logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards()
  @ApiLogout()
  async logout() {}
}
