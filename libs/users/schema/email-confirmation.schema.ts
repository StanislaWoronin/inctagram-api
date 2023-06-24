import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';
import { settings } from '../../shared/settings';

export interface IEmailConfirmation {
  confirmationCode: string;
  expirationDate: string;
  isConfirmed: boolean;
}

@Schema({ _id: false, versionKey: false })
export class EmailConfirmation {
  @Prop({ required: false, type: String, default: null })
  confirmationCode: string = randomUUID();

  @Prop({ required: false, type: String, default: null })
  expirationDate: string = add(new Date(), {
    hours: Number(settings.timeLife.CONFIRMATION_CODE),
  }).toISOString();

  @Prop({ required: false, type: Boolean, default: false })
  isConfirmed = false;
}

export const EmailConfirmationSchema =
  SchemaFactory.createForClass(EmailConfirmation);

export type EmailConfirmationDocument = HydratedDocument<EmailConfirmation>;
