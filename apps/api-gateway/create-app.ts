import cookieParser from 'cookie-parser';
import { INestApplication } from '@nestjs/common';

export const createApp = (app: INestApplication): INestApplication => {
  app.enableCors();
  app.use(cookieParser());
  return app;
};
