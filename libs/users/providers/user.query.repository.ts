import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {Devise, UserAggregate, UsersDocument} from '../schema';
import { Model } from 'mongoose';
import { SessionIdDto } from '../dto';

@Injectable()
export class UserQueryRepository {
  constructor(
    @InjectModel(UserAggregate.name)
    private userModel: Model<UsersDocument>,
  ) {}

  async getUserByIdOrLoginOrEmail(
    loginOrEmailOrId: string,
  ): Promise<UserAggregate | null> {
    return this.userModel.findOne({
      $or: [
        { id: loginOrEmailOrId },
        { email: loginOrEmailOrId },
        { login: loginOrEmailOrId },
      ],
    });
  }

  async userExists(userId: string): Promise<boolean> {
    const userExists = await this.userModel.exists({ id: userId });
    return !!userExists;
  }
}
