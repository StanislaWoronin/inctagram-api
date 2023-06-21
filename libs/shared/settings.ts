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
    API_GATEWAY_SERVICE: Number(process.env.API_GATEWAY_PORT),
    AUTH_MS: Number(process.env.AUTH_MS_PORT),
  },
  timeLife: {
    CONFIRMATION_CODE: '24', // hour
    ACCESS_TOKEN: '10000', // msec
    REFRESH_TOKEN: '20000', // msec
  },
};
