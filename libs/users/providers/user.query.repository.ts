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

  async getUserByField(data: string): Promise<UserAggregate | null> {
    return this.userModel.findOne({
      $or: [{ id: data }, { email: data }, { login: data }],
    });
  }

  async getUserByFiePasswordRecoveryCode(
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

  async getUserByConfirmationCode(code: string): Promise<UserAggregate | null> {
    return this.userModel.findOne({
      'emailConfirmationCode.confirmationCode': code,
    });
  }

  async getEmailConfirmationByCode(confirmationCode: string) {
    const emailConfirmation = await this.userModel
      .findOne({ 'emailConfirmation.confirmationCode': confirmationCode })
      .select({
        id: 1,
        // emailConfirmation: 1,
      });

    return emailConfirmation;
  }
}
