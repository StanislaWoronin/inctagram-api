import { NestFactory } from '@nestjs/core';
import { AppGatewayModule } from './app-gateway.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { createApp } from '../create-app';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { createWriteStream } from 'fs';
import { get } from 'http';

async function bootstrap() {
  const rawApp = await NestFactory.create(AppGatewayModule);
  const app = createApp(rawApp);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('API_GATEWAY');
  const serverUrl = configService.get<string>('BASE_URL');
  const userConfig = new DocumentBuilder()
    .setTitle('Inctagram-api')
    .setDescription('The Users API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const options1 = {
    explorer: true,
    showExtensions: true,
    swaggerOptions: {
      urls: [
        {
          url: `${serverUrl}/swagger-json`,
          name: 'Users API',
        },
      ],
    },
  };
  const usersDocument = SwaggerModule.createDocument(app, userConfig, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
    include: [AppGatewayModule],
  });
  SwaggerModule.setup('swagger', app, usersDocument, options1);
  if (process.env.NODE_ENV === 'development') {
    // write swagger ui files
    get(`${serverUrl}/swagger/swagger-ui-bundle.js`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui-bundle.js'));
    });

    get(`${serverUrl}/swagger/swagger-ui-init.js`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui-init.js'));
    });

    get(
      `${serverUrl}/swagger/swagger-ui-standalone-preset.js`,
      function (response) {
        response.pipe(
          createWriteStream('swagger-static/swagger-ui-standalone-preset.js'),
        );
      },
    );

    get(`${serverUrl}/swagger/swagger-ui.css`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui.css'));
    });
  }
  await app.listen(port, () => {
    Logger.log(
      `Application started on http://localhost:${port}.`,
      'Api-getaway.Main',
    );
    Logger.log(
      `Swagger documentation on http://localhost:${port}/swagger.`,
      'Api-getaway.Main',
    );
  });
}

bootstrap();
