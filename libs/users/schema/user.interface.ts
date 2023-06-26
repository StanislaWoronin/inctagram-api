import { EmailConfirmation } from './email-confirmation.schema';
import { Device } from './device.schema';

export interface IUser {
  id: string;
  devices: Device[];
  userName: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  passwordRecoveryCode: string | null;
  expirationDateForRecoveryCode: Date | null;
  emailConfirmation: EmailConfirmation;
  readonly password: string;
  readonly passwordConfirmation: string;
}
