import { AuthRequest } from './auth.request';
import { ViewUser } from '../../libs/users/response';
import {TLogin, TRegistration} from '../../apps/auth/dto';
import { UserWithTokensType } from '../types/user-with-tokens.type';
import {
  preparedLoginData,
  preparedRegistrationData,
} from '../prepared-data/prepared-user.data';
import {Testing} from "./testing.request";

export class UserFactory {
  constructor(
      private readonly authRequest: AuthRequest,
      private readonly testingRequest: Testing) {}

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
      const createdUser = await this.testingRequest.getUser(users[i].id)
      await this.authRequest.confirmRegistration(createdUser.emailConfirmation.confirmationCode);

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
}
