import { UserService } from '../domain/user.service';
import { IUser } from './user.interface';
import { randomUUID } from 'crypto';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { EmailConfirmation } from './email-confirmation.schema';
import { BadRequestException } from '@nestjs/common';
import { settings } from '../../shared/settings';
import bcrypt from 'bcrypt';
import { Device } from './device.schema';
import { RpcException } from '@nestjs/microservices';

@Schema()
export class UserAggregate extends UserService implements IUser {
  @Prop({ required: true, type: String })
  id: string = randomUUID();

  @Prop({ array: true, default: [] })
  devices: Device[];

  @Prop({ required: true, type: String })
  login: string;

  @Prop({ required: true, unique: true, type: String })
  email: string;

  @Prop({ required: true, type: String })
  passwordHash: string;

  @Prop({ type: Number })
  passwordRecoveryCode: number = null;

  @Prop({
    required: true,
    type: String,
    timestamps: true,
  })
  createdAt: string = new Date().toISOString();

  @Prop({
    required: true,
    type: EmailConfirmation,
  })
  emailConfirmation: EmailConfirmation = new EmailConfirmation();

  readonly password: string;
  readonly passwordConfirmation: string;

  static async create(user: Partial<IUser>) {
    if (user.password !== user.passwordConfirmation)
      throw new BadRequestException('Incorrect password confirmation');
    const _user = new UserAggregate();
    Object.assign(_user, user);
    const hash = await bcrypt.hash(user.password, 10);
    _user.passwordHash = hash;

    return _user;
  }
}

export const UserSchema = SchemaFactory.createForClass(UserAggregate);

export type UsersDocument = HydratedDocument<UserAggregate>;
