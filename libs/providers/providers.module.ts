import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfig } from './mongo-db';
import { UserAggregate, UserSchema } from '../users/schema';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongooseConfig,
    }),
    MongooseModule.forFeature([
      { name: UserAggregate.name, schema: UserSchema },
    ]),
  ],
})
export class ProvidersModule {}
