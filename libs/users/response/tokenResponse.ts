import { ApiProperty } from '@nestjs/swagger';

export class TokenResponse {
  @ApiProperty({
    type: String,
    description: 'Access token for user',
  })
  accessToken: string;
}
