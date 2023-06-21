import cookieParser from 'cookie-parser';
import { INestApplication } from '@nestjs/common';

export const createApp = (app: INestApplication): INestApplication => {
  app.use(cookieParser());
  return app;
};
