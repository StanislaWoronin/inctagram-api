import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IEmailConfirmation } from '../../../libs/users/schema';

export type TRegistrationConfirmation = Pick<
  IEmailConfirmation,
  'confirmationCode'
>;

export class RegistrationConfirmationDto implements TRegistrationConfirmation {
  @ApiProperty({ description: 'Registration confirmation code' })
  @IsString()
  //@Validate(ConfirmationCodeValidator)
  confirmationCode: string;
}
