import { IUser } from '../user.interface';

export type RegistrationDto = Pick<
  IUser,
  'name' | 'email' | 'password' | 'passwordConfirmation'
>;
