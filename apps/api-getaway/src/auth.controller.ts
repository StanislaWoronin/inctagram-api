import { Body, Controller, Inject, Post } from '@nestjs/common';
import { Microservices } from '../../../libs/shared';
import { ClientProxy } from '@nestjs/microservices';
import { Commands } from '../../../libs/shared/pattern-commands-name.enum';
import { RegistrationResponse } from '../../../libs/users/response';
import {ApiTags} from "@nestjs/swagger";
import {ApiRegistration} from "../../../libs/documentation/auth.documentation";
import {RegistrationDto} from "../dto/registration.dto";

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    @Inject(Microservices.Auth) private userProxyClient: ClientProxy,
  ) {}

  @Post('registration')
  @ApiRegistration()
  async registration(@Body() dto: RegistrationDto) {
    console.log('getaway')
    const pattern = { cmd: Commands.Registration };
    return this.userProxyClient.send<RegistrationResponse>(pattern, dto);
  }
}
