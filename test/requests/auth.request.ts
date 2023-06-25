import request from 'supertest';
import { TestResponse } from '../types/test-response';
import { LoginDto, RegistrationDto, TEmail } from '../../apps/auth/dto';
import { TokenResponse, ViewUser } from '../../libs/users/response';
import { faker } from '@faker-js/faker';
import { TLoginResponse } from '../types/login.response';
import { TErrorMessage } from '../types/error-message.type';

export class AuthRequest {
  constructor(private readonly server: any) {}

  async registrationUser(
    registrationUserDto: RegistrationDto,
  ): Promise<TestResponse<ViewUser>> {
    const response = await request(this.server)
      .post('/auth/registration')
      .send(registrationUserDto);

    return { body: response.body, status: response.status };
  }

  async loginUser(loginUserDto: LoginDto): Promise<TLoginResponse> {
    const response = await request(this.server)
      .post('/auth/login')
      .set('User-Agent', faker.internet.userAgent())
      .send(loginUserDto);

    return {
      accessToken: response.body.accessToken ?? null,
      refreshToken:
        response.headers['set-cookie'][0].split(';')[0].split('=')[1] ?? null,
      status: response.status,
    };
  }

  async resendingConfirmationCode(
    email: string,
  ): Promise<TestResponse<TErrorMessage>> {
    const response = await request(this.server)
      .post('/auth/confirmation-email-resending')
      .send({ email: email });

    return { body: response.body, status: response.status };
  }

  async confirmRegistration(
    code: string,
  ): Promise<TestResponse<TErrorMessage>> {
    const response = await request(this.server)
      .post('/auth/registration-confirmation')
      .send({ confirmationCode: code });

    return { body: response.body, status: response.status };
  }

  async sendPasswordRecovery(
    email: string,
  ): Promise<TestResponse<TErrorMessage>> {
    const response = await request(this.server)
      .post('/auth/password-recovery')
      .send({ email });

    return { body: response.body, status: response.status };
  }

  async newPassword(
    password: string,
    code: number,
  ): Promise<TestResponse<TErrorMessage>> {
    const response = await request(this.server)
      .post('/auth/new-password')
      .send({
        newPassword: password,
        passwordConfirmation: password,
        passwordRecoveryCode: code,
      });

    return { body: response.body, status: response.status };
  }
}
