import { Server } from "socket.io";
import { Room } from "./Room";
import { io } from "./server";
import { Socket } from "./Socket";

export class WS {
    public sockets: Map<string, Socket> = new Map();
    public rooms: Map<string, Room> = new Map();
    public io: Server;

    constructor() {
        this.io = io;
    }

    public getRoomBySocketId(socket: Socket) {
        return [...this.rooms.values()].find((room) => room.hasSocket(socket));
    }

    public addSocket(socket: Socket) {
        this.sockets.set(socket.id, socket);
    }

    public removeSocket(socket: Socket) {
        this.sockets.delete(socket.id);
    }

    public addRoom(room: Room) {
        this.rooms.set(room.id, room);
    }

    public removeRoom(room: Room) {
        this.rooms.delete(room.id);
    }
}
