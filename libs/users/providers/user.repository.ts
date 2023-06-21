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

  async createUser(user: UserAggregate) {
    const createdUser = await this.userModel.create(user);
    console.log(createdUser);
    return createdUser;
  }
}
