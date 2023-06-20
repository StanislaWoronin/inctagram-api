import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { RegistrationDto } from '../../../libs/users/dto';
import { Commands } from '../../../libs/shared';
import { RegistrationResponse } from '../../../libs/users/response';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: Commands.Registration })
  async registration(data: RegistrationDto): Promise<void> {}
}
