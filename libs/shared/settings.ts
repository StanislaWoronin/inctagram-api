import { Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
dotenv.config();

export const settings = {
  transportName: Transport.RMQ,
  rmqUrl: process.env.RMQ_URL,
  host: {
    localHost: '0.0.0.0',
  },
  port: {
    API_GATEWAY: Number(process.env.API_GATEWAY),
    AUTH_MS: Number(process.env.AUTH_MS),
  },
  timeLife: {
    CONFIRMATION_CODE: '24', // hour
    PASSWORD_RECOVERY_CODE: 86400000, // msec
    ACCESS_TOKEN: '10000', // msec
    REFRESH_TOKEN: '20000', // msec
  },
  SALT_GENERATE_ROUND: 10,
};
