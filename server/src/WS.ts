import { Server } from "socket.io";
import { Room } from "./Room";
import { adminNamespace, io } from "./server";
import { Socket } from "./Socket";

export class WS {
    public sockets: Map<string, Socket> = new Map();
    public rooms: Map<string, Room> = new Map();
    public io: Server;

    constructor() {
        this.io = io;
    }

    public addSocket(socket: Socket) {
        adminNamespace.emit("socket:connect", socket.dto);
        this.sockets.set(socket.id, socket);
    }

    public removeSocket(socket: Socket) {
        adminNamespace.emit("socket:disconnect", socket.id);
        this.sockets.delete(socket.id);
    }

    public addRoom(room: Room) {
        this.rooms.set(room.id, room);
        adminNamespace.emit("room:new", room.dto);
    }

    public removeRoom(room: Room) {
        adminNamespace.emit("room:delete", room.id);
        this.rooms.delete(room.id);
    }
}
