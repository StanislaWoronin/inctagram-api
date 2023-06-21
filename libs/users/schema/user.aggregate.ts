import { UserService } from '../domain/user.service';
import { IUser } from './user.interface';
import { IsEmail, IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';
import { Transform } from 'class-transformer';
import { userValidationConstant } from '../user-validation.constant';
import { randomUUID } from 'crypto';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { EmailConfirmation } from './email-confirmation.schema';

@Schema()
export class UserAggregate extends UserService implements IUser {
  @IsUUID()
  @Prop({ required: true, unique: true, type: String })
  id: string = randomUUID();

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Transform(({ value }) => value?.trim())
  @Prop({ required: true, unique: true, type: String })
  email: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @Length(
    userValidationConstant.nameLength.min,
    userValidationConstant.nameLength.max,
  )
  @Prop({ required: true, type: String })
  name: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @Length(
    userValidationConstant.passwordLength.min,
    userValidationConstant.passwordLength.max,
  )
  @Prop({ required: true, type: String })
  password: string;

  // @Validate() TODO add custom validation? Password must to be equal passwordConfirmation
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
  emailConfirmation: EmailConfirmation;

  static create(user: Partial<IUser>) {
    const _user = new UserAggregate();
    Object.assign(_user, user);
    return _user;
  }
}

export const UserSchema = SchemaFactory.createForClass(UserAggregate);

export type UsersDocument = HydratedDocument<UserAggregate>;
