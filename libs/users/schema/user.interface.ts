import { EmailConfirmation } from './email-confirmation.schema';
import {Devise} from "./devise.schema";

export interface IUser {
  id: string;
  devices: Devise[];
  login: string;
  email: string;
  passwordHash: string;
  passwordRecovery: number | null;
  createdAt: string;
  emailConfirmation: EmailConfirmation;
  readonly password: string;
  readonly passwordConfirmation: string;
}
