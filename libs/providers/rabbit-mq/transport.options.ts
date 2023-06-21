import { RmqOptions, TcpOptions, Transport } from '@nestjs/microservices';
import {Microservices} from "../../shared";
import {settings} from "../../shared/settings";

export const getTransportOptions = (
  serverName: Microservices,
): TcpOptions | RmqOptions => {
  switch (settings.transportName) {
    case Transport.TCP:
      return {
        transport: Transport.TCP,
        options: {
          host: settings.host.localHost,
          port: settings.port[serverName],
        },
      };
    case Transport.RMQ:
      return {
        transport: Transport.RMQ,
        options: {
          urls: [settings.rmqUrl],
          queue: serverName,
          queueOptions: {
            durable: true,
          },
        },
      };
  }
};
