import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { settings } from '../../shared/settings';

export interface IEmailConfirmation {
  confirmationCode: number;
  isConfirmed: boolean;
}

@Schema({ _id: false, versionKey: false })
export class EmailConfirmation {
  @Prop({ required: false, type: String, default: null })
  confirmationCode: number = Date.now() + settings.timeLife.CONFIRMATION_CODE;

  @Prop({ required: false, type: Boolean })
  isConfirmed = false;
}

export const EmailConfirmationSchema =
  SchemaFactory.createForClass(EmailConfirmation);

export type EmailConfirmationDocument = HydratedDocument<EmailConfirmation>;
