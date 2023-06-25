import cookieParser from 'cookie-parser';
import { INestApplication } from '@nestjs/common';
import { ExceptionFilter } from '../../libs/exception-filters/exception.filter';

export const createApp = (app: INestApplication): INestApplication => {
  app.enableCors();
  app.use(cookieParser());
  app.useGlobalFilters(new ExceptionFilter());
  return app;
};
