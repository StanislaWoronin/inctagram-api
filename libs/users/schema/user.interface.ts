import { EmailConfirmation } from './email-confirmation.schema';
import { Device } from './device.schema';

export interface IUser {
  id: string;
  devices: Device[];
  login: string;
  email: string;
  passwordHash: string;
  passwordRecoveryCode: number | null;
  createdAt: string;
  emailConfirmation: EmailConfirmation;
  readonly password: string;
  readonly passwordConfirmation: string;
}
