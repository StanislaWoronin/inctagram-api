import { AuthRequest } from './auth.request';
import { Testing } from './testing.request';

export class Requests {
  private readonly server: any;
  constructor(server) {
    this.server = server;
  }

  auth() {
    return new AuthRequest(this.server);
  }

  testing() {
    //eturn new Testing();
  }
}
