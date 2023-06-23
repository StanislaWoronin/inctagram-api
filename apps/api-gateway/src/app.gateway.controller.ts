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
import { RefreshTokenValidationGuard } from '../../../libs/guards/refresh-token-validation.guard';
import { CurrentDeviceId } from '../../../libs/decorators/device-id.decorator';
import { CurrentUser } from '../../../libs/decorators/current-user.decorator';

@Controller()
@ApiTags('Auth')
export class AppGatewayController {
  constructor(
    @Inject(Microservices.Auth) private authProxyClient: ClientProxy,
  ) {}

  @Get()
  @ApiExcludeEndpoint()
  async mainEntry() {
    return 'Welcome to INCTAGRAM API!!!';
  }

  @Post('auth/registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiRegistration()
  async registration(@Body() dto: RegistrationDto) {
    const pattern = { cmd: Commands.Registration };
    return this.authProxyClient.send(pattern, dto);
  }

  @Post('auth/login')
  @HttpCode(HttpStatus.OK)
  @ApiLogin()
  @UseGuards()
  async login(@Body() dto: LoginDto) {
    const pattern = { cmd: Commands.Login };
    return this.authProxyClient.send(pattern, dto);
  }

  @Post('auth/registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiRegistrationEmailResending()
  async registrationEmailResending(
    @Body() email: ResendingEmailConfirmationDto,
  ) {
    const pattern = { cmd: Commands.EmailResending };
    return this.authProxyClient.send(pattern, email);
  }

  @Post('auth/registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiRegistrationConfirmation()
  async registrationConfirmation(@Body() dto: RegistrationConfirmationDto) {
    const pattern = { cmd: Commands.RegistrationConfirmation };
    return this.authProxyClient.send(pattern, dto);
  }

  @Post('auth/password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiPasswordRecovery()
  async passwordRecovery(@Body() dto: PasswordRecoveryDto) {
    const pattern = { cmd: Commands.PasswordRecovery };
    return this.authProxyClient.send(pattern, dto.email);
  }

  @Post('auth/new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNewPassword()
  async updatePassword(
    @Body() { newPassword, recoveryCode }: NewPasswordDto,
    @CurrentUser() userId: string,
  ) {
    const pattern = { cmd: Commands.UpdatePassword };
    return this.authProxyClient.send(pattern, {
      userId,
      newPassword,
      recoveryCode,
    });
  }

  @Post('auth/refresh-token')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenValidationGuard)
  @ApiRefreshToken()
  async updatePairToken(
    @CurrentUser() userId: string,
    @CurrentDeviceId() deviceId: string,
  ) {
    const pattern = { cmd: Commands.UpdatePairToken };
    return this.authProxyClient.send(pattern, { userId, deviceId });
  }

  @Post('auth/logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RefreshTokenValidationGuard)
  @ApiLogout()
  async logout(@CurrentUser() userId: string) {
    const pattern = { cmd: Commands.Logout };
    return this.authProxyClient.send(pattern, { userId });
  }
}
