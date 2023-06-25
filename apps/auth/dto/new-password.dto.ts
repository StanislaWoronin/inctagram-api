import { IsString, Length, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { userValidationConstant } from '../../../libs/users/user-validation.constant';
import { IUser } from '../../../libs/users/schema';
import { IsConfirmationCodeExist } from '../../../libs/decorators/confirmation-code.decorator';

export type TNewPassword = Pick<IUser, 'passwordRecoveryCode'> & {
  newPassword: string;
  passwordConfirmation: string;
};

export class NewPasswordDto implements TNewPassword {
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

  @ApiProperty()
  @IsString()
  @IsConfirmationCodeExist()
  passwordConfirmation: string;

  @ApiProperty({ description: 'Password recovery code' })
  @IsString()
  //@Validate(PasswordRecoveryValidator)
  passwordRecoveryCode: number;
}
