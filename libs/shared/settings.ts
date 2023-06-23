import { Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
dotenv.config();

export const settings = {
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
    ACCESS_TOKEN: '1 hour', // hour
    REFRESH_TOKEN: '24 hours', // hour
  },
};
