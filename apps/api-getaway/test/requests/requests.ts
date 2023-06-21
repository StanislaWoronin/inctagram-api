import {AuthRequest} from "./auth.request";

export class Requests {
    private readonly server: any;
    constructor(server) {
        this.server = server;
    }

    auth() {
        return new AuthRequest(this.server)
    }
}