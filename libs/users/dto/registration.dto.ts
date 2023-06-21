import { IUser } from '../schema';

export type RegistrationDto = Pick<
  IUser,
  'name' | 'email' | 'passwordHash' | 'passwordConfirmation'
>;
