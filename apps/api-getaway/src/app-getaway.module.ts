import { Module } from '@nestjs/common';
import { SharedModule } from '../../../libs';
import { Microservices } from '../../../libs/shared';
import { ClientsModule } from '@nestjs/microservices';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { getProviderOptions } from '../../../libs/providers/rabbit-mq/providers.option';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    SharedModule,
    ClientsModule.register([getProviderOptions(Microservices.Auth)]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'swagger-static'),
      serveRoot: process.env.NODE_ENV === 'development' ? '/' : '/swagger',
    }),
    ClientsModule.register([getProviderOptions(Microservices.Auth)]),
  ],
  controllers: [AuthController],
  providers: [],
})
export class AppGetawayModule {}
