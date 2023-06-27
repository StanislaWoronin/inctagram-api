import { ViewUser } from '../../../libs/users/response';

export const createUserResponse = (
  userName: string,
  email: string,
): ViewUser => {
  return {
    id: expect.any(String),
    userName,
    email,
    createdAt: expect.any(String),
  };
};
