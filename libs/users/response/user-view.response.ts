import { IUser } from '../schema';
import { ApiProperty } from '@nestjs/swagger';

type TViewUser = Pick<IUser, 'id' | 'login' | 'email' | 'createdAt'>;

export class ViewUser implements TViewUser {
  @ApiProperty({ description: 'UUID' })
  id: string;

  @ApiProperty({ example: 'UserLogin' })
  login: string;

  @ApiProperty({ example: 'somemail@mail.com' })
  email: string;

  @ApiProperty({ example: new Date().toISOString() })
  createdAt: string;

  static create(user) {
    return {
      id: user.id,
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}
