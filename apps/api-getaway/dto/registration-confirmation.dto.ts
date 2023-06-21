import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RegistrationConfirmationDto {
  @ApiProperty({ description: 'Registration confirmation code' })
  @IsString()
  //@Validate(ConfirmationCodeValidator)
  code: string;
}
