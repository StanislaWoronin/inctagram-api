import { UserService } from './domain/user.service';
import { IUser } from './user.interface';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
  Matches,
} from 'class-validator';
import { Exclude, Transform } from 'class-transformer';
import { userValidationConstant } from './user-validation.constant';

export class UserAggregate extends UserService implements IUser {
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Transform(({ value }) => value?.trim())
  email: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @Length(
    userValidationConstant.nameLength.min,
    userValidationConstant.nameLength.max,
  )
  @Matches(/^[a-zA-Z0-9_-]*$/)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @Length(
    userValidationConstant.passwordLength.min,
    userValidationConstant.passwordLength.max,
  )
  password: string;

  // @Validate() TODO add custom validation? Password must to be equal passwordConfirmation
  passwordConfirmation: string;

  createdAt: string;

  private constructor() {
    super();
  }

  static create(user: string) {
    return user;
  }
}
