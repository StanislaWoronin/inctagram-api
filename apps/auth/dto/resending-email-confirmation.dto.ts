import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';

export class ResendingEmailConfirmationDto {
  @ApiProperty({
    description: 'E-mail to which the confirmation code will be sent',
  })
  @IsEmail()
  @Transform(({ value }) => value?.trim())
  //@Validate(EmailResendingValidator)
  email: string;
}
