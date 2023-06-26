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
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Commands, Microservices } from '../../../libs/shared';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
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
} from '../../../libs/documentation/swagger/auth.documentation';
import {
  TNewPassword,
  TRegistration,
  TEmail,
  TLogin,
  TRegistrationConfirmation,
  EmailDto,
} from '../../auth/dto';
import { RefreshTokenValidationGuard } from '../../../libs/guards/refresh-token-validation.guard';
import { Response } from 'express';
import { CurrentDeviceId } from '../../../libs/decorators/device-id.decorator';
import { CurrentUser } from '../../../libs/decorators/current-user.decorator';
import { settings } from '../../../libs/shared/settings';
import { lastValueFrom, map } from 'rxjs';
import { TokenResponse, ViewUser } from '../../../libs/users/response';
import { ClientProxy } from '@nestjs/microservices';

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
  @ApiRegistration()
  async registration(@Body() dto: TRegistration): Promise<ViewUser> {
    const pattern = { cmd: Commands.Registration };
    return await lastValueFrom(
      this.authProxyClient.send(pattern, dto).pipe(map((result) => result)),
    );
  }

  @Post('auth/registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiRegistrationConfirmation()
  async registrationConfirmation(
    @Body() dto: TRegistrationConfirmation,
  ): Promise<boolean> {
    const pattern = { cmd: Commands.RegistrationConfirmation };
    return await lastValueFrom(
      this.authProxyClient.send(pattern, dto).pipe(map((result) => result)),
    );
  }

  @Post('auth/login')
  @HttpCode(HttpStatus.OK)
  @ApiLogin()
  async login(
    @Body() dto: TLogin,
    @Ip() ipAddress: string,
    @Headers('user-agent') title: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<TokenResponse> {
    const pattern = { cmd: Commands.Login };
    const tokens = await lastValueFrom(
      this.authProxyClient
        .send(pattern, { ...dto, ipAddress, title })
        .pipe(map((result) => result)),
    );

    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: settings.timeLife.TOKEN_TIME,
    });
    return { accessToken: tokens.accessToken };
  }

  @Post('auth/confirmation-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiRegistrationEmailResending()
  async confirmationCodeResending(@Body() dto: TEmail): Promise<boolean> {
    const pattern = { cmd: Commands.ConfirmationCodeResending };
    return await lastValueFrom(
      this.authProxyClient.send(pattern, dto).pipe(map((result) => result)),
    );
  }

  @Post('auth/password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiPasswordRecovery()
  async passwordRecovery(@Body() dto: TEmail): Promise<boolean> {
    const pattern = { cmd: Commands.PasswordRecovery };
    return await lastValueFrom(
      this.authProxyClient.send(pattern, dto).pipe(map((result) => result)),
    );
  }

  @Post('auth/new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNewPassword()
  async updatePassword(@Body() dto: TNewPassword): Promise<boolean> {
    const pattern = { cmd: Commands.UpdatePassword };
    return await lastValueFrom(
      this.authProxyClient.send(pattern, dto).pipe(map((result) => result)),
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
    @Res({ passthrough: true }) response: Response,
  ): Promise<TokenResponse> {
    const pattern = { cmd: Commands.UpdatePairToken };
    console.log({ userId, deviceId, ipAddress, title });
    const tokens = await lastValueFrom(
      this.authProxyClient
        .send(pattern, { userId, deviceId, ipAddress, title })
        .pipe(map((result) => result)),
    );

    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: settings.timeLife.TOKEN_TIME,
    });
    return { accessToken: tokens.accessToken };
  }

  @Post('auth/logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RefreshTokenValidationGuard)
  @ApiLogout()
  async logout(
    @CurrentUser() userId: string,
    @CurrentDeviceId() deviceId: string,
  ): Promise<boolean> {
    const pattern = { cmd: Commands.Logout };
    return await lastValueFrom(
      this.authProxyClient
        .send(pattern, { userId, deviceId })
        .pipe(map((result) => result)),
    );
  }

  @Delete('testing/delete-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiDropDatabase()
  async deleteDataInDb() {
    const pattern = { cmd: Commands.DeleteAll };
    return await lastValueFrom(
      this.authProxyClient.send(pattern, {}).pipe(map((result) => result)),
    );
  }

  @Get('testing/users/:data')
  @ApiDropDatabase()
  async getUser(@Param() data: string) {
    const pattern = { cmd: Commands.GetUser };
    return await lastValueFrom(
      this.authProxyClient.send(pattern, data).pipe(map((result) => result)),
    );
  }
}
