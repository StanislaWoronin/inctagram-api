import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { add } from 'date-fns';
import { randomUUID } from 'crypto';
import { settings } from '../../shared/settings';

export interface IEmailConfirmation {
  confirmationCode: string;
  isConfirmed: boolean;
}

@Schema({ _id: false, versionKey: false })
export class EmailConfirmation {
  @Prop({ required: false, type: String })
  confirmationCode: string = randomUUID();

  @Prop({ required: false, type: Date })
  expirationDate: Date = add(new Date(), {
    hours: settings.timeLife.CONFIRMATION_CODE,
  });

  @Prop({ required: false, type: Boolean })
  isConfirmed = false;
}

export const EmailConfirmationSchema =
  SchemaFactory.createForClass(EmailConfirmation);

export type EmailConfirmationDocument = HydratedDocument<EmailConfirmation>;
