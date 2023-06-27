import { ViewUser } from '../../libs/users/response';

export type UserWithTokensType = {
  user: ViewUser;
  accessToken: string;
  refreshToken: string;
};
