import { Module } from '@nestjs/common';
import { SharedModule } from '../../../libs';
import { Microservices } from '../../../libs/shared';
import { ClientsModule } from '@nestjs/microservices';
import { getProviderOptions } from '../../../libs/providers/rabbit-mq/providers.option';
import { AppGatewayController } from './app.gateway.controller';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfig } from '../../../libs/providers/mongo-db';
import { UserAggregate, UserSchema } from '../../../libs/users/schema';
import { UserQueryRepository } from '../../../libs/users/providers/user.query.repository';
import { TestingRepository } from '../../auth/src/testing.repository';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongooseConfig,
    }),
    MongooseModule.forFeature([
      { name: UserAggregate.name, schema: UserSchema },
    ]),
    SharedModule,
    ClientsModule.register([getProviderOptions(Microservices.Auth)]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'swagger-static'),
      serveRoot: process.env.NODE_ENV === 'development' ? '/' : '/swagger',
    }),
  ],
  controllers: [AppGatewayController],
  providers: [JwtService, UserQueryRepository, TestingRepository],
})
export class AppGatewayModule {}
