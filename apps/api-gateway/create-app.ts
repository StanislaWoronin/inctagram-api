import cookieParser from 'cookie-parser';
import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { ErrorExceptionFilter } from '../../libs/exception-filters/error-exception.filter';
import { HttpExceptionFilter } from '../../libs/exception-filters/exception.filter';
import { useContainer } from 'class-validator';
import { AppGatewayModule } from './src/app.gateway.module';

const validationPipeSettings = {
  transform: true,
  stopAtFirstError: true,

  exceptionFactory: (errorsMessages) => {
    console.log('pipe');
    const errorsForResponse = [];

    errorsMessages.forEach((e) => {
      const keys = Object.keys(e.constraints);
      errorsForResponse.push({
        message: e.constraints[keys[0]],
        field: e.property,
      });
    });

    throw new BadRequestException(errorsForResponse);
  },
};

export const createApp = (app: INestApplication): INestApplication => {
  app.enableCors();
  app.use(cookieParser());
  app.useGlobalFilters(new ErrorExceptionFilter(), new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe(validationPipeSettings));
  useContainer(app.select(AppGatewayModule), { fallbackOnErrors: true });
  return app;
};
