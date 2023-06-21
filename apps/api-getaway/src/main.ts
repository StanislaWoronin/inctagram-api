import { NestFactory } from '@nestjs/core';
import { AppGetawayModule } from './app-getaway.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { createApp } from '../create-app';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  const rawApp = await NestFactory.create(AppGetawayModule);
  const app = createApp(rawApp);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('API_GATEWAY');
  const config = new DocumentBuilder()
      .setTitle('Inctagram-api')
      .setDescription('Documentation REST API')
      .setVersion('1.0.0')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);

  await app.listen(port, () => {
    Logger.log(
      `Application started on http://localhost:${port}.`,
      'Api-getaway.Main',
    );
    Logger.log(
        `Swagger documentation on http://localhost:${port}/docs.`,
        'Api-getaway.Main',
    );
  });
}

bootstrap();
