import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { UserAggregate, UsersDocument } from '../../../libs/users/schema';
import { logLevel } from '@nestjs/microservices/external/kafka.interface';

@Injectable()
export class TestingRepository {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(UserAggregate.name)
    private userModel: Model<UsersDocument>,
  ) {}

  async deleteAll() {
    return await this.connection.db.dropDatabase();
  }

  async getUser(loginOrEmailOrId: string): Promise<UserAggregate | null> {
    return this.userModel.findOne({
      $or: [
        { id: loginOrEmailOrId },
        { email: loginOrEmailOrId },
        { login: loginOrEmailOrId },
      ],
    });
  }
}
