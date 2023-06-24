import { Injectable } from '@nestjs/common';
import { Device, UserAggregate, UsersDocument } from '../schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

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

  async removeDeviceId(userId: string, deviceId: string): Promise<boolean> {
    const result = await this.userModel.updateOne(
      { id: userId },
      { $pull: { userDevicesData: { deviceId: deviceId } } },
    );

    return result.modifiedCount === 1;
  }

  async updateEmailConfirmationCode(
    userId: string,
    emailConfirmationCode: string,
  ): Promise<boolean> {
    const result = await this.userModel.updateOne(
      { id: userId },
      { $set: { 'emailConfirmation.confirmationCode': emailConfirmationCode } },
    );
    return result.modifiedCount === 1;
  }

  async updateUserEmailStatus(
    userId: string,
    status: boolean,
  ): Promise<boolean> {
    const result = await this.userModel.updateOne(
      { id: userId },
      { $set: { 'emailConfirmation.isConfirmed': status } },
    );
    return result.modifiedCount === 1;
  }
}
