import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

export class Testing {
  constructor(@InjectConnection() private connection: Connection) {}

  async deleteAll(): Promise<boolean> {
    try {
      await this.connection.db.dropDatabase();

      return true;
    } catch (e) {
      console.log('deleteAll:', e);
      return false;
    }
  }
}
