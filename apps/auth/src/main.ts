import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { Microservices } from '../../../libs/shared';
import { getTransportOptions } from '../../../libs/providers/rabbit-mq/transport.options';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    getTransportOptions(Microservices.Auth),
  );

  await app.listen();
}
bootstrap();
