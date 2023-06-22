import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AppGatewayModule } from '../src/app.gateway.module';
import { createApp } from '../create-app';
import { Requests } from './requests/requests';
import { preparedRegistrationData } from './prepared-data/prepared-registration.data';
import { preparedLoginData } from './prepared-data/prepared-login-data';

describe('Test auth controller.', () => {
  const second = 1000;
  jest.setTimeout(5 * second);

  let app: INestApplication;
  let server;
  let requests: Requests;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppGatewayModule],
    }).compile();

    const rawApp = await moduleFixture.createNestApplication();
    app = createApp(rawApp);
    await app.init();

    server = await app.getHttpServer();
    requests = new Requests(server);
  });

  describe('Create new user', () => {
    it(`Should create new user. Status ${HttpStatus.CREATED}.`, async () => {
      const response = await requests
        .auth()
        .registrationUser(preparedRegistrationData.valid);
      console.log(response);
    });
  });

  describe('Log user', () => {
    it(`Should return access and refresh JWT tokens. Status ${HttpStatus.OK}.`, async () => {
      const response = await requests
        .auth()
        .loginUser(preparedLoginData.valid1);
      console.log(response);
    });
  });
});
