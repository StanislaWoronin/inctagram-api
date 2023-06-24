export class SessionIdDto {
  userId: string;
  deviceId: string;
}

export type WithClientMeta<T> = T & { ipAddress: string; title: string };
