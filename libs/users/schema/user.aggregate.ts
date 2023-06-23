import { UserService } from '../domain/user.service';
import { IUser } from './user.interface';
import { randomUUID } from 'crypto';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { EmailConfirmation } from './email-confirmation.schema';
import bcrypt from 'bcrypt';

Schema();
export class UserAggregate extends UserService implements IUser {
  @Prop({ required: true, type: String })
  id: string = randomUUID();

  @Prop({ type: [String, null], default: [null] })
  deviceId: string | null[];

  @Prop({ required: true, type: String })
  login: string;

  @Prop({ required: true, type: String })
  email: string;

  @Prop({ required: true, type: String })
  password: string;

  passwordHash: string;

  passwordConfirmation: string;

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

  static async create(user: Partial<IUser>): Promise<UserAggregate> {
    user.passwordHash = await bcrypt.hash(user.password, 10);
    const _user = new UserAggregate();
    Object.assign(_user, user);
    return _user;
  }
}

export const UserSchema = SchemaFactory.createForClass(UserAggregate);

export type UsersDocument = HydratedDocument<UserAggregate>;
