import { IUser } from '../schema';

export type RegistrationDto = Pick<
  IUser,
  'login' | 'email' | 'password' | 'passwordConfirmation'
>;
