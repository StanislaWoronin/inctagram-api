import {AuthRequest} from './auth.request';
import {ViewUser} from '../../libs/users/response';
import {TLogin, TRegistration} from '../../apps/auth/dto';
import {UserWithTokensType} from '../types/user-with-tokens.type';
import {preparedLoginData, preparedRegistrationData,} from '../prepared-data/prepared-user.data';
import {Testing} from './testing.request';
import {faker} from "@faker-js/faker";
import request from 'supertest';

export class UserFactory {
  constructor(
    private readonly server: any,
    private readonly authRequest: AuthRequest,
    private readonly testingRequest: Testing,
  ) {}

  async createUsers(usersCount: number, startWith = 0): Promise<ViewUser[]> {
    const result = [];
    for (let i = 0; i < usersCount; i++) {
      const inputData: TRegistration = {
        userName: `UserLogin${i + startWith}`,
        email: `somemail${i + startWith}@gmail.com`,
        password: 'qwerty123',
        passwordConfirmation: 'qwerty123',
      };

      const response = await this.authRequest.registrationUser(inputData);

      result.push(response.body);
    }

    return result;
  }

  async createAndLoginUsers(
    userCount: number,
    startWith = 0,
  ): Promise<UserWithTokensType[]> {
    const users = await this.createUsers(userCount, startWith);

    const result = [];
    for (let i = 0; i < userCount; i++) {
      const createdUser = await this.testingRequest.getUser(users[i].id);

      await this.authRequest.confirmRegistration(
        createdUser.emailConfirmation.confirmationCode,
      );

      const userLoginData: TLogin = {
        email: createdUser.email,
        password: preparedRegistrationData.valid.password,
      };

      const response = await this.authRequest.loginUser(userLoginData);

      result.push({
        user: users[i],
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });
    }

    return result;
  }

  async createAndLoginOneUserManyTimes(loginCount: number): Promise<UserWithTokensType> {
    const [user] = await this.createAndLoginUsers(1);
    const userWithTokens = { user: user.user, accessToken: null, refreshToken: null };

    const userLoginData = {
      email: user.user.email,
      password: preparedLoginData.valid.password,
    };

    for (let i = 0; i < loginCount - 1; i++) {
      const response = await request(this.server)
          .post('/auth/login')
          .set('User-Agent', faker.internet.userAgent())
          .send(userLoginData);

      userWithTokens.accessToken = response.body.accessToken;
      userWithTokens.refreshToken = response.headers['set-cookie'][0]
          .split(';')[0]
          .split('=')[1];
    }

    return userWithTokens;
  }
}
