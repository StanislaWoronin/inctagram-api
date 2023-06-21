import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserAggregate, UsersDocument } from '../schema';
import { Model } from 'mongoose';

@Injectable()
export class UserQueryRepository {
  constructor(
    @InjectModel(UserAggregate.name)
    private userModel: Model<UsersDocument>,
  ) {}

  async getUserByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<UserAggregate | null> {
    return this.userModel.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    });
  }
}
