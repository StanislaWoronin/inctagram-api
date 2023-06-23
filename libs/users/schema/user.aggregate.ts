import { UserService } from '../domain/user.service';
import { IUser } from './user.interface';
import { randomUUID } from 'crypto';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { EmailConfirmation } from './email-confirmation.schema';
import { BadRequestException } from '@nestjs/common';
import { settings } from '../../shared/settings';
import bcrypt from 'bcrypt';

@Schema()
export class UserAggregate extends UserService implements IUser {
  @Prop({ required: true, unique: true, type: String })
  id: string = randomUUID();

  @Prop({ unique: true, type: String })
  deviseId: string = null;

  @Prop({ required: true, type: String })
  login: string;

  @Prop({ required: true, type: String })
  email: string;

  @Prop({ required: true, type: String })
  passwordHash: string;

  @Prop({ type: Number })
  passwordRecovery: number = null;

  password: string;

  passwordConfirmation: string;

  deviceId: string = null;

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

  static async create(user: Partial<IUser>) {
    if (user.password !== user.passwordConfirmation)
      throw new BadRequestException('Incorrect password confirmation');
    const _user = new UserAggregate();
    Object.assign(_user, user);
    const salt = await bcrypt.genSalt(Number(settings.SALT_GENERATE_ROUND));
    const hash = await bcrypt.hash(user.password, salt);
    _user.passwordHash = hash;
    return _user;
  }
}

export const UserSchema = SchemaFactory.createForClass(UserAggregate);

export type UsersDocument = HydratedDocument<UserAggregate>;
