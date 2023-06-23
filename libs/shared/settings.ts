import { Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
dotenv.config();

export const settings = {
  environment: process.env.NODE_ENV,
  transportName: Transport.TCP,
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
    ONE_DAY: 24 * 60 * 60 * 1000, // milliseconds
    TOKEN_TIME: 20 * 1000, // milliseconds
    ACCESS_TOKEN: '10 seconds', // seconds
    REFRESH_TOKEN: '20 seconds', // seconds
  },
};
