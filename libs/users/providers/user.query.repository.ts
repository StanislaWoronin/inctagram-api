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

  async getUserByField(
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

  async getUserByFieldPasswordRecoveryCode(
    code: number,
  ): Promise<UserAggregate | null> {
    return this.userModel.findOne({
      passwordRecoveryCode: code,
    });
  }

  async userExists(userId: string): Promise<boolean> {
    const userExists = await this.userModel.exists({ id: userId });
    return !!userExists;
  }

  async getUserByConfirmationCode(code: number): Promise<UserAggregate | null> {
    return this.userModel.findOne({
      'emailConfirmation.confirmationCode': code,
    });
  }
}
