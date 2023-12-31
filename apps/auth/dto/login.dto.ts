import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, Length } from 'class-validator';
import { userValidationConstant } from '../../../libs/users/user-validation.constant';
import { IUser } from '../../../libs/users/schema';
import { IsEmailExist } from '../../../libs/decorators/email.decorator';

export type TLogin = Pick<IUser, 'password'> & { email: string };

export class LoginDto implements TLogin {
  @ApiProperty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsEmailExist()
  email: string;

  @ApiProperty({
    minLength: userValidationConstant.passwordLength.min,
    maxLength: userValidationConstant.passwordLength.max,
  })
  @IsString()
  @Transform(({ value }) => value?.trim())
  @Length(
    userValidationConstant.passwordLength.min,
    userValidationConstant.passwordLength.max,
  )
  password: string;
}
