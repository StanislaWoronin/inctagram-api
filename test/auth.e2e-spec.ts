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
import {
  EmailDto,
  NewPasswordDto,
  RegistrationConfirmationDto,
  RegistrationDto,
} from '../apps/auth/dto';
import { errorsMessage } from './response/error.response';
import { settings } from '../libs/shared/settings';
import { EmailManager } from '../libs/adapters/email.adapter';
import { EmailManagerMock } from './mock/email-adapter.mock';
import { sleep } from './helpers';

describe('Test auth controller.', () => {
  const second = 1000;
  jest.setTimeout(10 * second);

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
    })
      .overrideProvider(EmailManager)
      .useValue(new EmailManagerMock())
      .compile();

    const rawApp = await moduleFixture.createNestApplication();
    app = createApp(rawApp);
    await app.init();
    testingRepository = app.get(TestingRepository);
    server = await app.getHttpServer();
    requests = new Requests(server);
  });
  afterAll(async () => {
    await mms.stop();
    await app.close();
  });

  describe('Create new user', () => {
    it('Clear data base.', async () => {
      await requests.testing().deleteAll();
    });

    const errors = errorsMessage<RegistrationDto>([
      'email',
      'userName',
      'password',
    ]);
    it(`Status ${HttpStatus.BAD_REQUEST}. Try registration with SHORT input data.`, async () => {
      const response = await requests
        .auth()
        .registrationUser(preparedRegistrationData.incorrect.short);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body).toEqual(errors);
    });

    it(`Status ${HttpStatus.BAD_REQUEST}. Try registration with LONG input data.`, async () => {
      const response = await requests
        .auth()
        .registrationUser(preparedRegistrationData.incorrect.long);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body).toStrictEqual(errors);
    });

    it(`Status ${HttpStatus.CREATED}. Should create new user.`, async () => {
      const response = await requests
        .auth()
        .registrationUser(preparedRegistrationData.valid);
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toStrictEqual(
        createUserResponse(
          preparedRegistrationData.valid.userName,
          preparedRegistrationData.valid.email,
        ),
      );
    });

    it(`Status ${HttpStatus.CREATED}. A registered user with an unconfirmed
     email address is trying to re-register.`, async () => {
      const response = await requests
        .auth()
        .registrationUser(preparedRegistrationData.valid);
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toStrictEqual(
        createUserResponse(
          preparedRegistrationData.valid.userName,
          preparedRegistrationData.valid.email,
        ),
      );
    });
  });

  describe('Registration confirmation.', () => {
    it('Create data.', async () => {
      await requests.testing().deleteAll();
      const user = await requests
        .auth()
        .registrationUser(preparedRegistrationData.valid);
      const createdUser = await requests.testing().getUser(user.body.id);

      expect.setState({
        userId: user.body.id,
        code: createdUser.emailConfirmation.confirmationCode,
      });
    });

    const error = errorsMessage<RegistrationConfirmationDto>([
      'confirmationCode',
    ]);
    it(`Status ${HttpStatus.BAD_REQUEST}. Try confirm email with expired code.`, async () => {
      const { code } = expect.getState();

      const response = await requests
        .auth()
        .confirmRegistration(code - settings.timeLife.CONFIRMATION_CODE);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body).toStrictEqual(error);
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

  describe('Log user', () => {
    it('Create data.', async () => {
      await requests.testing().deleteAll();
      const user = await requests
        .auth()
        .registrationUser(preparedRegistrationData.valid);
      const createdUser = await requests.testing().getUser(user.body.id);

      expect.setState({
        code: createdUser.emailConfirmation.confirmationCode,
      });
    }, 10000);

    it(`Status ${HttpStatus.UNAUTHORIZED}. User tries to log in without confirming the email.`, async () => {
      const response = await requests.auth().loginUser({
        email: preparedLoginData.valid.email,
        password: preparedLoginData.valid.password,
      });

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it(`Status ${HttpStatus.UNAUTHORIZED}. User try login with incorrect email.`, async () => {
      const { code } = expect.getState();

      await requests.auth().confirmRegistration(code);
      const response = await requests.auth().loginUser({
        email: preparedLoginData.incorrect.email,
        password: preparedLoginData.valid.password,
      });
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it(`Status ${HttpStatus.UNAUTHORIZED}. User try login with incorrect password.`, async () => {
      const response = await requests.auth().loginUser({
        email: preparedLoginData.valid.email,
        password: preparedLoginData.incorrect.password,
      });
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
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
    }, 10000);

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

  describe('Password recovery.', () => {
    it('Create data.', async () => {
      await requests.testing().deleteAll();
      const [user] = await requests.userFactory().createAndLoginUsers(1);

      expect.setState({
        userId: user.user.id,
        userEmail: user.user.email,
      });
    });

    const error = errorsMessage<EmailDto>(['email']);
    it(`Status ${HttpStatus.BAD_REQUEST}. User is trying to recover the
     password with incorrect input data .`, async () => {
      const response = await requests
        .auth()
        .sendPasswordRecovery(preparedRegistrationData.incorrect.long.email);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body).toStrictEqual(error);
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
    }, 10000);

    it(`Status ${HttpStatus.BAD_REQUEST}. Try get new password with expired code.`, async () => {
      const { passwordRecoveryCode } = expect.getState();
      const error = errorsMessage<NewPasswordDto>(['passwordRecoveryCode']);

      const code = passwordRecoveryCode - settings.timeLife.CONFIRMATION_CODE;
      const newPassword = 'NewPassword';
      const response = await requests.auth().newPassword(newPassword, code);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body).toStrictEqual(error);
    });

    it(`Status ${HttpStatus.BAD_REQUEST}. Try get new password but new password equal old.`, async () => {
      const { passwordRecoveryCode } = expect.getState();
      const error = errorsMessage<NewPasswordDto>(['newPassword']);

      const newPassword = preparedLoginData.valid.password;
      const response = await requests
        .auth()
        .newPassword(newPassword, passwordRecoveryCode);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body).toStrictEqual(error);
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
    it(`Create data.`, async () => {
      await requests.testing().deleteAll();
      const [user] = await requests.userFactory().createAndLoginUsers(1);

      expect.setState({
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
      });
    });

    it(`Status ${HttpStatus.UNAUTHORIZED}. Shouldn't update pair if refresh token is incorrect`, async () => {
      const { refreshToken } = expect.getState();
      const token = refreshToken.replace('.');

      const response = await requests.auth().updatePairTokens(token);
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it.skip(`Status ${HttpStatus.UNAUTHORIZED}. Shouldn't update pair if refresh expired.`, async () => {
      const { refreshToken } = expect.getState();

      await sleep(3); // update setting
      const response = await requests.auth().updatePairTokens(refreshToken);
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    }, 5000);

    it('Should update pair tokens.', async () => {
      const { refreshToken } = expect.getState();

      const newTokens = await requests.auth().updatePairTokens(refreshToken);
      expect(newTokens.status).toBe(HttpStatus.OK);
      expect(newTokens.accessToken).toBeTruthy();
      expect(newTokens.refreshToken).toBeTruthy();
      // expect(newTokens.accessToken).not.toBe(accessToken);
      // expect(newTokens.refreshToken).not.toBe(refreshToken); // idk but ft updated after some time
    });
  });

  describe('Logout from system.', () => {
    it('Create data.', async () => {
      await requests.testing().deleteAll();
      const [user] = await requests.userFactory().createAndLoginUsers(1);

      expect.setState({
        userId: user.user.id,
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
      });
    });

    it(`Status ${HttpStatus.UNAUTHORIZED}. Shouldn't logout if refresh token is incorrect`, async () => {
      const { refreshToken } = expect.getState();
      const token = refreshToken.replace('.');

      const response = await requests.auth().logout(token);
      expect(response).toBe(HttpStatus.UNAUTHORIZED);
    });

    it.skip(`Status ${HttpStatus.UNAUTHORIZED}. Shouldn't logout if refresh expired.`, async () => {
      const { refreshToken } = expect.getState();

      await sleep(3); // update setting
      const response = await requests.auth().logout(refreshToken);
      expect(response).toBe(HttpStatus.UNAUTHORIZED);
    }, 5000);

    it(`Status ${HttpStatus.NO_CONTENT}. Logout from system.`, async () => {
      const { userId, refreshToken } = expect.getState();
      const response = await requests.auth().logout(refreshToken);
      expect(response).toBe(HttpStatus.NO_CONTENT);

      const user = await requests.testing().getUser(userId);
      expect(user.devices.length).toBe(0);
    });

    describe('Create many device and delete last.', () => {
      const loginCount = 5
      it('Create data', async () => {
        await requests.testing().deleteAll();
        const lastSession = await requests.userFactory().createAndLoginOneUserManyTimes(loginCount)

        expect.setState({
          lastSession: lastSession,
          userId: lastSession.user.id,
          accessToken: lastSession.accessToken,
          refreshToken: lastSession.refreshToken
        })
      })

      it(`Status ${HttpStatus.NO_CONTENT}. Logout from last session.`, async () => {
        const { userId, refreshToken } = expect.getState()

        await requests.auth().logout(refreshToken)
        const user = await requests.testing().getUser(userId);
        expect(user.devices.length).toBe(loginCount - 1);
      })
    })
  });
});
