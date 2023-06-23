import { EmailConfirmation } from './email-confirmation.schema';

export interface IUser {
  id: string;
  devicesId: string[];
  login: string;
  email: string;
  passwordHash: string;
  passwordRecovery: number | null;
  createdAt: string;
  emailConfirmation: EmailConfirmation;
  readonly password: string;
  readonly passwordConfirmation: string;
}
