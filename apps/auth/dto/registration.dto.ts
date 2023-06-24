import { ApiProperty } from '@nestjs/swagger';
import { userValidationConstant } from '../../../libs/users/user-validation.constant';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';
import { IUser } from '../../../libs/users/schema';

export type TRegistration = Pick<
  IUser,
  'login' | 'email' | 'password' | 'passwordConfirmation'
>;

export class RegistrationDto implements TRegistration {
  @ApiProperty({ example: 'somemail@mail.com', description: 'User`s email' })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Transform(({ value }) => value?.trim())
  email: string;

  @ApiProperty({
    example: 'UserLogin',
    description: 'User`s login',
    minLength: userValidationConstant.nameLength.min,
    maxLength: userValidationConstant.nameLength.max,
  })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @Length(
    userValidationConstant.nameLength.min,
    userValidationConstant.nameLength.max,
  )
  login: string;

  @ApiProperty({
    example: 'qwerty123',
    description: 'User`s password',
    minLength: userValidationConstant.passwordLength.min,
    maxLength: userValidationConstant.passwordLength.max,
  })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @Length(
    userValidationConstant.passwordLength.min,
    userValidationConstant.passwordLength.max,
  )
  password: string;

  @ApiProperty()
  passwordConfirmation: string;
}
