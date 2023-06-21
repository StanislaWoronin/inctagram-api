import { IUser } from '../schema/user.interface';

export type RegistrationDto = Pick<
  IUser,
  'name' | 'email' | 'password' | 'passwordConfirmation'
>;
