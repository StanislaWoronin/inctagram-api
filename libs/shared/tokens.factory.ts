import { settings } from './settings';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from './enums/tokens.enum';
import { Injectable } from '@nestjs/common';
import { PairTokenResponse } from '../users/response';

@Injectable()
export class Factory {
  constructor(private jwtService: JwtService) {}

  async getPairTokens(
    userId: string,
    deviceId: string,
  ): Promise<PairTokenResponse> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateToken(Tokens.AccessToken, userId, deviceId),
      this.generateToken(Tokens.RefreshToken, userId, deviceId),
    ]);

    return { accessToken, refreshToken };
  }

  private generateToken(
    tokenType: Tokens,
    userId: string,
    deviceId: string,
  ): Promise<string> {
    return this.jwtService.signAsync(
      {
        id: userId,
        deviceId: deviceId,
      },
      {
        secret: settings.secret[tokenType],
        expiresIn: settings.timeLife[tokenType],
      },
    );
  }
}
