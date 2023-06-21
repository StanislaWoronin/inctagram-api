import { Microservices } from '../../shared';
import { ClientProviderOptions, Transport } from '@nestjs/microservices';
import { settings } from '../../shared/settings';

export const getProviderOptions = (
  serverName: Microservices,
): ClientProviderOptions => {
  switch (settings.transportName) {
    case Transport.TCP:
      return {
        name: serverName,
        transport: Transport.TCP,
        options: {
          host: settings.host.localHost,
          port: settings.port[serverName],
        },
      };
    case Transport.RMQ:
      return {
        name: serverName,
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
