import { io } from "./server";

export class WS {
    public get allSockets() {
        return io.sockets.sockets;
    }

    public get allRooms() {
        return io.sockets.adapter.rooms;
    }
}
