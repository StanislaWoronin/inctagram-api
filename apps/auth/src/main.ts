import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import {AuthModule} from "./auth.module";

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('AUTH_MS_PORT');
  await app.listen(port, () => {
    Logger.log(`Application started on http://localhost:${port}.`, 'Auth.Main');
  });
}
bootstrap();
