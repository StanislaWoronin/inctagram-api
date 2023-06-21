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
import { ApiTags } from '@nestjs/swagger';
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
import { RegistrationDto } from '../dto/registration.dto';
import { LoginDto } from '../dto/login.dto';
import { ResendingEmailConfirmationDto } from '../dto/resending-email-confirmation.dto';
import { RegistrationConfirmationDto } from '../dto/registration-confirmation.dto';
import { PasswordRecoveryDto } from '../dto/password-recovery.dto';
import { NewPasswordDto } from '../dto/new-password.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    @Inject(Microservices.Auth) private userProxyClient: ClientProxy,
  ) {}

  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiRegistration()
  async registration(@Body() dto: RegistrationDto) {
    console.log('getaway');
    const pattern = { cmd: Commands.Registration };
    return this.userProxyClient.send(pattern, dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiLogin()
  @UseGuards()
  async login(@Body() dto: LoginDto) {}

  @Post('registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiRegistrationEmailResending()
  async registrationEmailResending(
    @Body() email: ResendingEmailConfirmationDto,
  ) {}

  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiRegistrationConfirmation()
  async registrationConfirmation(@Body() dto: RegistrationConfirmationDto) {}

  @Post('password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiPasswordRecovery()
  async passwordRecovery(@Body() dto: PasswordRecoveryDto) {}

  @Post('new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNewPassword()
  async createNewPassword(@Body() dto: NewPasswordDto) {}

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @UseGuards()
  @ApiRefreshToken()
  async createRefreshToken() {}

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards()
  @ApiLogout()
  async logout() {}
}
