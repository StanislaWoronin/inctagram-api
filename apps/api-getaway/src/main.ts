import { NestFactory } from '@nestjs/core';
import { AppGetawayModule } from './app-getaway.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { createApp } from '../create-app';

async function bootstrap() {
  const rawApp = await NestFactory.create(AppGetawayModule);
  const app = createApp(rawApp);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('API_GATEWAY_PORT');
  await app.listen(port, () => {
    Logger.log(
      `Application started on http://localhost:${port}.`,
      'Api-getaway.Main',
    );
  });
}

bootstrap();
