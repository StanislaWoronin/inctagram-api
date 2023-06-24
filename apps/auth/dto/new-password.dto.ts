import { IsString, Length, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { userValidationConstant } from '../../../libs/users/user-validation.constant';
import { IUser } from '../../../libs/users/schema';

export type TNewPassword = Pick<IUser, 'passwordRecoveryCode'>;

export class NewPasswordDto implements TNewPassword {
  userId: string;

  @ApiProperty({
    description: 'New password',
    minLength: userValidationConstant.passwordLength.min,
    maxLength: userValidationConstant.passwordLength.max,
  })
  @IsString()
  @Length(
    userValidationConstant.passwordLength.min,
    userValidationConstant.passwordLength.max,
  )
  newPassword: string;

  @ApiProperty({ description: 'Password recovery code' })
  @IsString()
  //@Validate(PasswordRecoveryValidator)
  passwordRecoveryCode: number;
}
