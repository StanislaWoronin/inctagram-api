import { Injectable } from '@nestjs/common';
import { Device, UserAggregate, UsersDocument } from '../schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { add } from 'date-fns';
import { settings } from '../../shared/settings';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(UserAggregate.name)
    private userModel: Model<UsersDocument>,
  ) {}

  async createUser(user: UserAggregate): Promise<UsersDocument> {
    return await this.userModel.create(user);
  }

  async createUserDevice(userId: string, device: Device): Promise<boolean> {
    const result = await this.userModel.updateOne(
      { id: userId },
      { $push: { devices: device } },
    );

    return result.modifiedCount === 1;
  }

  async setPasswordRecovery(
    userId: string,
    passwordRecoveryCode: number,
  ): Promise<boolean> {
    const result = await this.userModel.updateOne(
      { id: userId },
      { $set: { passwordRecoveryCode } },
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

  async removeDeviceId(userId: string, deviceId: string): Promise<boolean> {
    const result = await this.userModel.updateOne(
      { id: userId },
      { $pull: { devises: {deviceId: deviceId} } },
    )

    return result.modifiedCount === 1;
  }

  async updateEmailConfirmationCode(
    userId: string,
    emailConfirmationCode: number,
  ): Promise<boolean> {
    const newDate = add(new Date(), {
      hours: settings.timeLife.CONFIRMATION_CODE,
    });
    const result = await this.userModel.updateOne(
      { id: userId },
      {
        $set: {
          'emailConfirmation.confirmationCode': emailConfirmationCode,
          'emailConfirmation.expirationDate': newDate,
        },
      },
    );
    return result.modifiedCount === 1;
  }

  async updateUserConfirmationStatus(userId: string): Promise<boolean> {
    const result = await this.userModel.updateOne(
      { id: userId },
      {
        $set: {
          'emailConfirmation.confirmationCode': null,
          'emailConfirmation.expirationDate': null,
          'emailConfirmation.isConfirmed': true,
        },
      },
    );
    return result.modifiedCount === 1;
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await this.userModel.deleteOne({ id });
    return result.deletedCount === 1;
  }
}
