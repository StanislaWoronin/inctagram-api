import { IUser, UserAggregate } from '../schema';
import { ApiProperty } from '@nestjs/swagger';

type TViewUser = Pick<IUser, 'id' | 'userName' | 'email' | 'createdAt'>;

export class ViewUser implements TViewUser {
  @ApiProperty({ description: 'UUID' })
  id: string;

  @ApiProperty({ example: 'UserLogin' })
  userName: string;

  @ApiProperty({ example: 'somemail@mail.com' })
  email: string;

  @ApiProperty({ example: new Date().toISOString() })
  createdAt: string;

  static create(user): ViewUser {
    return {
      id: user.id,
      userName: user.userName,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}
