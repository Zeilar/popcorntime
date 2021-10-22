import { io } from "./server";

export class WS {
    public get sockets() {
        return io.sockets.sockets;
    }

    public get rooms() {
        return io.sockets.adapter.rooms;
    }
}
