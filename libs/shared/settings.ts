import { Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
dotenv.config();

export const settings = {
  environment: process.env.NODE_ENV,
  transportName: Transport.TCP,
  rmqUrl: process.env.RMQ_URL,
  host: {
    localHost: '149.248.193.195',
  },
  port: {
    API_GATEWAY: Number(process.env.API_GATEWAY),
    AUTH_MS: Number(process.env.AUTH_MS),
  },
  secret: {
    ACCESS_TOKEN: process.env.JWT_ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN: process.env.JWT_REFRESH_TOKEN_SECRET,
  },
  timeLife: {
    CONFIRMATION_CODE: 24 * 60 * 60 * 1000, // milliseconds
    PASSWORD_RECOVERY_CODE: 24 * 60 * 60 * 1000, // milliseconds
    TOKEN_TIME: 20 * 1000, // milliseconds
    ACCESS_TOKEN: '10 seconds',
    REFRESH_TOKEN: '20 seconds',
  },
};
