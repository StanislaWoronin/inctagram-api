import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserAggregate, UsersDocument } from '../schema';
import { Model } from 'mongoose';
import { SessionIdDto } from '../dto';

@Injectable()
export class UserQueryRepository {
  constructor(
    @InjectModel(UserAggregate.name)
    private userModel: Model<UsersDocument>,
  ) {}

  async getUserByLoginOrEmail(
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

  async getUserDeviceId(userId: string): Promise<string | null> {
    return this.userModel.findOne({ id: userId });
  }

  async removeDeviceId(userId: string): Promise<boolean> {
    const result = await this.userModel.updateOne(
      { id: userId },
      { $set: { deviseId: null } },
    );

    return result.modifiedCount === 1;
  }
}