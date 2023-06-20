import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { Microservices } from '../../../libs/shared';
import { ClientProxy } from '@nestjs/microservices';
import { Commands } from '../../../libs/shared/pattern-commands-name.enum';
import { RegistrationDto } from '../../../libs/users/dto';
import { RegistrationResponse } from '../../../libs/users/response';

@Controller()
export class AppGetawayController {
  constructor(
    @Inject(Microservices.Auth) private userProxyClient: ClientProxy,
  ) {}

  @Post('registration')
  async registration(@Body() dto: RegistrationDto) {
    const pattern = { cmd: Commands.Registration };
    return this.userProxyClient.send<RegistrationResponse>(pattern, dto);
  }
}
