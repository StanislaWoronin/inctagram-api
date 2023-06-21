import { Module } from '@nestjs/common';
import { AppGetawayController } from './app-getaway.controller';
import { SharedModule } from '../../../libs';
import { Microservices } from '../../../libs/shared';
import { ClientsModule } from '@nestjs/microservices';
import { getProviderOptions } from '../../../libs/providers/providers.option';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    SharedModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'swagger-static'),
      serveRoot: process.env.NODE_ENV === 'development' ? '/' : '/swagger',
    }),
    ClientsModule.register([getProviderOptions(Microservices.Auth)]),
  ],
  controllers: [AppGetawayController],
  providers: [],
})
export class AppGetawayModule {}
