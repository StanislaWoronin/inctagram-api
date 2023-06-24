import request from 'supertest';
import { TestResponse } from '../types/test-response';
import { ViewUser } from '../../../../libs/users/response';
import { LoginDto, TRegistration } from '../../../auth/dto';
import { LoginResponse } from '../../../../libs/users/response';

export class AuthRequest {
  constructor(private readonly server: any) {}

  async registrationUser(
    registrationUserDto: TRegistration,
  ): Promise<TestResponse<ViewUser>> {
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
