import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';
import { IUser } from '../../../libs/users/schema';

export type TEmail = Pick<IUser, 'email'>;

export class EmailDto implements TEmail {
  @ApiProperty()
  @IsEmail()
  @Transform(({ value }) => value?.trim())
  //@Validate(EmailResendingValidator)
  email: string;
}
