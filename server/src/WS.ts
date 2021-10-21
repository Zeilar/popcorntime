import { io } from "./server";
import { Server } from "socket.io";

export class WS {
    constructor(public readonly io: Server) {}

    public get sockets() {
        return io.sockets.sockets;
    }

    public get rooms() {
        return io.sockets.adapter.rooms;
    }
}
