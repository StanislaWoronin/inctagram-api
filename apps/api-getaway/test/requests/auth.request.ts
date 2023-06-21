import request from 'supertest';
import { RegistrationDto } from '../../../../libs/users/dto';
import { TestResponse } from '../types/test-response';
import { RegistrationResponse } from '../../../../libs/users/response';

export class AuthRequest {
  constructor(private readonly server: any) {}

  async registrationUser(
    registrationUserDto: RegistrationDto,
  ): Promise<TestResponse<RegistrationResponse>> {
    const response = await request(this.server)
      .post('/auth/registration')
      .send(registrationUserDto);

    return { body: response.body, status: response.status };
  }
}
