import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Inject,
  Ip,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import {Commands, Microservices} from '../../../libs/shared';
import {ClientProxy} from '@nestjs/microservices';
import {ApiExcludeEndpoint} from '@nestjs/swagger';
import {
  ApiDropDatabase,
  ApiLogin,
  ApiLogout,
  ApiNewPassword,
  ApiPasswordRecovery,
  ApiRefreshToken,
  ApiRegistration,
  ApiRegistrationConfirmation,
  ApiRegistrationEmailResending,
} from '../../../libs/documentation/auth.documentation';
import {RegistrationDto} from '../../auth/dto/registration.dto';
import {LoginDto} from '../../auth/dto/login.dto';
import {ResendingEmailConfirmationDto} from '../../auth/dto/resending-email-confirmation.dto';
import {RegistrationConfirmationDto} from '../../auth/dto/registration-confirmation.dto';
import {PasswordRecoveryDto} from '../../auth/dto/password-recovery.dto';
import {NewPasswordDto} from '../../auth/dto/new-password.dto';
import {RefreshTokenValidationGuard} from '../../../libs/guards/refresh-token-validation.guard';
import {Response} from 'express';
import {CurrentDeviceId} from '../../../libs/decorators/device-id.decorator';
import {CurrentUser} from '../../../libs/decorators/current-user.decorator';
import {settings} from '../../../libs/shared/settings';
import {lastValueFrom, map} from 'rxjs';
import {LoginResponse, ViewUser} from '../../../libs/users/response';

@Controller()
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
  async registration(@Body() dto: RegistrationDto): Promise<ViewUser> {
    const pattern = { cmd: Commands.Registration };
    return await lastValueFrom(
      this.authProxyClient.send(pattern, dto).pipe(map((result) => result)),
    );
  }

  @Post('auth/login')
  @HttpCode(HttpStatus.OK)
  @ApiLogin()
  async login(
    @Body() dto: LoginDto,
    @Ip() ipAddress: string,
    @Headers('user-agent') title: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponse> {
    const pattern = { cmd: Commands.Login };
    const tokens = await lastValueFrom(
      this.authProxyClient.send(pattern, {dto, ipAddress, title}).pipe(map((result) => result)),
    );
    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: settings.timeLife.TOKEN_TIME,
    });
    return { accessToken: tokens.accessToken };
  }

  @Post('auth/registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiRegistrationEmailResending()
  async registrationEmailResending(
    @Body() email: ResendingEmailConfirmationDto,
  ) {
    const pattern = { cmd: Commands.EmailConfirmationCodeResending };
    return await lastValueFrom(
      this.authProxyClient.send(pattern, email).pipe(map((result) => result)),
    );
  }

  @Post('auth/registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiRegistrationConfirmation()
  async registrationConfirmation(@Body() dto: RegistrationConfirmationDto) {
    const pattern = { cmd: Commands.RegistrationConfirmation };
    return await lastValueFrom(
      this.authProxyClient.send(pattern, dto).pipe(map((result) => result)),
    );
  }

  @Post('auth/password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiPasswordRecovery()
  async passwordRecovery(@Body() dto: PasswordRecoveryDto) {
    const pattern = { cmd: Commands.PasswordRecovery };
    return await lastValueFrom(
      this.authProxyClient
        .send(pattern, dto.email)
        .pipe(map((result) => result)),
    );
  }

  @Post('auth/new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNewPassword()
  async updatePassword(
    @Body() { newPassword, recoveryCode }: NewPasswordDto,
    @CurrentUser() userId: string,
  ) {
    const pattern = { cmd: Commands.UpdatePassword };
    return await lastValueFrom(
      this.authProxyClient
        .send(pattern, {
          userId,
          newPassword,
          recoveryCode,
        })
        .pipe(map((result) => result)),
    );
  }

  @Post('auth/refresh-token')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenValidationGuard)
  @ApiRefreshToken()
  async updatePairToken(
    @CurrentUser() userId: string,
    @CurrentDeviceId() deviceId: string,
    @Ip() ipAddress: string,
    @Headers('user-agent') title: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const dto = { userId, deviceId, ipAddress, title };
    const pattern = { cmd: Commands.UpdatePairToken };
    return await lastValueFrom(
      this.authProxyClient
        .send(pattern, dto)
        .pipe(map((result) => result)),
    );
  }

  @Post('auth/logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RefreshTokenValidationGuard)
  @ApiLogout()
  async logout(
    @CurrentUser() userId: string,
    @CurrentDeviceId() deviceId: string,
  ) {
    const pattern = { cmd: Commands.Logout };
    return await lastValueFrom(
      this.authProxyClient
        .send(pattern, { userId, deviceId })
        .pipe(map((result) => result)),
    );
  }

  @Delete('delete-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiDropDatabase()
  async deleteDataInDb(): Promise<boolean> {
    return true;
  }
}
