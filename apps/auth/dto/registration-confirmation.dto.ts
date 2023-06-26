import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IEmailConfirmation } from '../../../libs/users/schema';
import { IsConfirmationCodeExist } from '../../../libs/decorators/confirmation-code.decorator';

export type TRegistrationConfirmation = Pick<
  IEmailConfirmation,
  'confirmationCode'
>;

export class RegistrationConfirmationDto implements TRegistrationConfirmation {
  @ApiProperty({ description: 'Registration confirmation code' })
  @IsString()
  @IsConfirmationCodeExist() // TODO не работает
  confirmationCode: number;
}
