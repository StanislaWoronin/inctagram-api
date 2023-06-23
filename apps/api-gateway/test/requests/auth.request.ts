import request from 'supertest';
import { RegistrationDto } from '../../../../libs/users/dto';
import { TestResponse } from '../types/test-response';
import { UserViewResponse } from '../../../../libs/users/response';
import { LoginDto } from '../../../auth/dto/login.dto';
import { LoginResponse } from '../../../../libs/users/response/login.response';

export class AuthRequest {
  constructor(private readonly server: any) {}

  async registrationUser(
    registrationUserDto: RegistrationDto,
  ): Promise<TestResponse<UserViewResponse>> {
    const response = await request(this.server)
      .post('/auth/registration')
      .send(registrationUserDto);

    return { body: response.body, status: response.status };
  }

  async loginUser(
    loginUserDto: LoginDto,
  ): Promise<TestResponse<LoginResponse>> {
    const response = await request(this.server)
      .post('/auth/login')
      .send(loginUserDto);

    return { body: response.body, status: response.status };
  }
}
