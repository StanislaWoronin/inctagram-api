import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AppGatewayModule } from '../apps/api-gateway/src/app.gateway.module';
import { createApp } from '../apps/api-gateway/create-app';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Requests } from './requests/requests';
import { createUserResponse } from './response/auth/create-user.response';
import {
  preparedLoginData,
  preparedRegistrationData,
} from './prepared-data/prepared-user.data';
import { TestingRepository } from '../apps/auth/src/testing.repository';

describe('Test auth controller.', () => {
  const second = 1000;
  jest.setTimeout(5 * second);

  let app: INestApplication;
  let server;
  let mms: MongoMemoryServer;
  let requests: Requests;
  let testingRepository: TestingRepository;

  beforeAll(async () => {
    mms = await MongoMemoryServer.create();
    const mongoUrl = mms.getUri();
    process.env['MONGO_URI'] = mongoUrl;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppGatewayModule],
    }).compile();

    const rawApp = await moduleFixture.createNestApplication();
    app = createApp(rawApp);
    await app.init();
    testingRepository = app.get(TestingRepository);
    server = await app.getHttpServer();
    requests = new Requests(server);
  });

  describe('Create new user', () => {
    it('Clear data base.', async () => {
      await requests.testing().deleteAll();
    });

    it.skip(`Status ${HttpStatus.BAD_REQUEST}. Try registration with SHORT input data.`, async () => {
      const response = await requests
        .auth()
        .registrationUser(preparedRegistrationData.incorrect.short);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it(`Status ${HttpStatus.CREATED}. Should create new user.`, async () => {
      const response = await requests
        .auth()
        .registrationUser(preparedRegistrationData.valid);
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toStrictEqual(
        createUserResponse(
          preparedRegistrationData.valid.login,
          preparedRegistrationData.valid.email,
        ),
      );
    });
  });

  describe('Log user', () => {
    it('Create data.', async () => {
      await requests.testing().deleteAll();
      await requests.auth().registrationUser(preparedRegistrationData.valid);
    });

    it(`Status ${HttpStatus.OK}. Should return access and refresh JWT tokens. `, async () => {
      const response = await requests.auth().loginUser(preparedLoginData.valid);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.accessToken).toBeTruthy();
      expect(response.refreshToken).toBeTruthy();
    });
  });

  describe('Resending confirmation code.', () => {
    it('Create data.', async () => {
      await requests.testing().deleteAll();
      const [user] = await requests.userFactory().createAndLoginUsers(1);
      const createdUser = await requests.testing().getUser(user.user.id);

      expect.setState({
        userId: user.user.id,
        userEmail: user.user.email,
        confirmationCode: createdUser.emailConfirmation.confirmationCode,
      });
    });

    it(`Status ${HttpStatus.NO_CONTENT}. Should send email confirmation.`, async () => {
      const { userId, userEmail, confirmationCode } = expect.getState();

      const response = await requests
        .auth()
        .resendingConfirmationCode(userEmail);
      expect(response.status).toBe(HttpStatus.NO_CONTENT);

      const user = await requests.testing().getUser(userId);
      const newConfirmationCode = user.emailConfirmation.confirmationCode;
      expect(confirmationCode).not.toBe(newConfirmationCode);
    });
  });

  describe('Registration confirmation.', () => {
    it('Create data.', async () => {
      await requests.testing().deleteAll();
      const [user] = await requests.userFactory().createAndLoginUsers(1);
      const createdUser = await requests.testing().getUser(user.user.id);

      expect.setState({
        userId: user.user.id,
        code: createdUser.emailConfirmation.confirmationCode,
      });
    });

    it(`Status ${HttpStatus.NO_CONTENT}. Registration confirm.`, async () => {
      const { userId, code } = expect.getState();

      const response = await requests.auth().confirmRegistration(code);
      expect(response.status).toBe(HttpStatus.NO_CONTENT);

      const user = await requests.testing().getUser(userId);
      const isConfirmed = user.emailConfirmation.isConfirmed;
      expect(isConfirmed).toBe(true);
    });
  });

  describe('Password recovery.', () => {
    it('Create data.', async () => {
      await requests.testing().deleteAll();
      const [user] = await requests.userFactory().createAndLoginUsers(1);

      expect.setState({
        userId: user.user.id,
        userEmail: user.user.email,
      });
    });

    it(`Status ${HttpStatus.NO_CONTENT}. Should send password recovery code.`, async () => {
      const { userId, userEmail } = expect.getState();

      const response = await requests.auth().sendPasswordRecovery(userEmail);
      expect(response.status).toBe(HttpStatus.NO_CONTENT);
      const user = await requests.testing().getUser(userId);
      const passwordRecoveryCode = user.passwordRecoveryCode;
      expect(passwordRecoveryCode).toBeDefined();
    });
  });

  describe('New password.', () => {
    it('Create data.', async () => {
      await requests.testing().deleteAll();
      const [user] = await requests.userFactory().createAndLoginUsers(1);
      await requests.auth().sendPasswordRecovery(user.user.email);
      const _user = await requests.testing().getUser(user.user.id);

      expect.setState({
        userId: user.user.id,
        passwordRecoveryCode: _user.passwordRecoveryCode,
        passwordHash: _user.passwordHash,
      });
    });

    it(`Status ${HttpStatus.NO_CONTENT}. Should save new password.`, async () => {
      const { userId, passwordRecoveryCode, passwordHash } = expect.getState();

      const newPassword = 'newPassword';
      const response = await requests
        .auth()
        .newPassword(newPassword, passwordRecoveryCode);
      expect(response.status).toBe(HttpStatus.NO_CONTENT);
      const user = await requests.testing().getUser(userId);
      const newPasswordHash = user.passwordHash;
      expect(passwordHash).not.toBe(newPasswordHash);
    });
  });

  describe('Update pair tokens.', () => {
    it(`Status ${HttpStatus.NO_CONTENT}. Create data.`, async () => {
      await requests.testing().deleteAll();
      const [user] = await requests.userFactory().createAndLoginUsers(1);
      const response = await requests.auth().loginUser({
        loginOrEmail: user.user.login,
        password: preparedLoginData.valid.password,
      });
      console.log(user.user.id);
      expect.setState({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });
    });

    it('Should update pair tokens.', async () => {
      const { accessToken, refreshToken } = expect.getState();

      const newTokens = await requests.auth().updatePairTokens(refreshToken);
      expect(newTokens.status).toBe(HttpStatus.OK);
      expect(newTokens.accessToken).toBeTruthy();
      expect(newTokens.refreshToken).toBeTruthy();
      expect(newTokens.accessToken).not.toBe(accessToken);
      expect(newTokens.refreshToken).not.toBe(refreshToken);
    });
  });
});
