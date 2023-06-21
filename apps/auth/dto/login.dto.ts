import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, Length } from 'class-validator';
import { userValidationConstant } from '../../../libs/users/user-validation.constant';

export class LoginDto {
  @ApiProperty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  loginOrEmail: string;

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
