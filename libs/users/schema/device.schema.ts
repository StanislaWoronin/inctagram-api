import { Prop, Schema } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';

interface IDevice {
  deviceId;
  ipAddress;
  title;
}

@Schema({ _id: false, versionKey: false })
export class Device implements IDevice {
  @Prop({
    required: true,
    type: String,
    default: randomUUID(),
  })
  deviceId: string;

  @Prop({ required: true, type: String })
  ipAddress: string;

  @Prop({ required: true, type: String })
  title: string;

  static create(device: Partial<IDevice>) {
    const _device = new Device();
    Object.assign(_device, device);
    return _device;
  }
}
