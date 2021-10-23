import { Server } from "socket.io";
import { Room } from "./Room";
import { io } from "./server";
import { Socket } from "./Socket";

export class WS {
    private allSockets: Socket[] = [];
    private allRooms: Room[] = [];
    public io: Server;

    constructor() {
        this.io = io;
    }

    public getRoom(roomId?: string | null) {
        return this.allRooms.find((room) => room.id === roomId);
    }

    public getSocket(socketId?: string | null) {
        return this.allSockets.find((socket) => socket.id === socketId);
    }

    public addSocket(socket: Socket) {
        if (this.allSockets.some((element) => element.id === socket.id)) {
            return false;
        }
        this.allSockets.push(socket);
    }

    public removeSocket(socket: Socket) {
        this.allSockets = this.allSockets.filter(
            (element) => element.id !== socket.id
        );
    }

    public addRoom(room: Room) {
        if (this.allRooms.some((element) => element.id === room.id)) {
            return false;
        }
        this.allRooms.push(room);
    }

    public removeRoom(room: Room) {
        this.allRooms = this.allRooms.filter(
            (element) => element.id !== room.id
        );
    }
}
