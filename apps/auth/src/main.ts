import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { MicroserviceOptions, RpcException } from '@nestjs/microservices';
import { Microservices } from '../../../libs/shared';
import { getTransportOptions } from '../../../libs/providers/rabbit-mq/transport.options';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

export const validationPipeSettings = {
  transform: true,
  stopAtFirstError: true,
  exceptionFactory: (errors) => {
    const errorsForResponse = [];
    errors.forEach((e) => {
      const constraintsKeys = Object.keys(e.constraints);
      // constraintsKeys.forEach((key) => {
      //   errorsForResponse.push({
      //     message: e.constraints[key],
      //     field: e.property,
      //   });
      // });
      errorsForResponse.push({
        message: e.constraints[constraintsKeys[0]],
        field: e.property,
      });
    });
    throw new RpcException(errorsForResponse);
  },
};

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    getTransportOptions(Microservices.Auth),
  );
  app.useGlobalPipes(new ValidationPipe(validationPipeSettings));
  useContainer(app.select(AuthModule), { fallbackOnErrors: true });
  await app.listen();
}
bootstrap();
