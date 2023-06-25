import { NestFactory } from '@nestjs/core';
import { AppGatewayModule } from './app.gateway.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { createApp } from '../create-app';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const rawApp = await NestFactory.create(AppGatewayModule);
  const app = createApp(rawApp);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('API_GATEWAY');
  const serverUrl = `https://inctagram-api.fly.dev`;
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
  await app.listen(port, () => {
    Logger.log(
      `Application listen on http://localhost:${port}`,
      'Api-getaway.Main',
    );
    Logger.log(`Application started on ${serverUrl}`, 'Api-getaway.Main');
    Logger.log(
      `Swagger documentation on ${serverUrl}/swagger`,
      'Api-getaway.Main',
    );
  });
}

bootstrap();
