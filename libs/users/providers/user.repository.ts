import { Injectable } from '@nestjs/common';
import { UserAggregate, UsersDocument } from '../schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(UserAggregate.name)
    private userModel: Model<UsersDocument>,
  ) {}

  async createUser(user: UserAggregate): Promise<UsersDocument> {
    console.log('COrrect', user);
    return await this.userModel.create(user);
  }

  async createUserDeviceId(user: UserAggregate): Promise<boolean> {
    const result = await this.userModel.updateOne(
      { id: user.id },
      { $set: { deviceId: user.deviceId } },
    );
    return result.modifiedCount === 1;
  }

  async setPasswordRecovery(
    userId: string,
    passwordRecovery: number,
  ): Promise<boolean> {
    const result = await this.userModel.updateOne(
      { id: userId },
      { $set: { passwordRecovery } },
    );
    return result.modifiedCount === 1;
  }

  async updateUserPassword(
    userId: string,
    passwordHash: string,
  ): Promise<boolean> {
    const result = await this.userModel.updateOne(
      { id: userId },
      {
        $set: {
          passwordHash,
          passwordRecovery: null,
        },
      },
    );
    return result.modifiedCount === 1;
  }

  async removeDeviceId(userId: string): Promise<boolean> {
    const result = await this.userModel.updateOne(
      { id: userId },
      { $pull: { deviceId: null } },
    );

    return result.modifiedCount === 1;
  }
}
