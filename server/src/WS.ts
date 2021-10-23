import { Room } from "./Room";
import { Socket } from "./Socket";

export class WS {
    public allSockets: Socket[] = [];
    public allRooms: Room[] = [];

    public getRoom(roomId: string) {
        return this.allRooms.find((room) => room.id === roomId);
    }

    public getSocket(socketId: string) {
        return this.allSockets.find((socket) => socket.id === socketId);
    }

    public addGlobalSocket(socket: Socket) {
        if (this.allSockets.some((element) => element.id === socket.id)) {
            return false;
        }
        this.allSockets.push(socket);
    }

    public removeGlobalSocket(socket: Socket) {
        this.allSockets = this.allSockets.filter(
            (element) => element.id !== socket.id
        );
    }

    public addGlobalRoom(room: Room) {
        if (this.allRooms.some((element) => element.id === room.id)) {
            return false;
        }
        this.allRooms.push(room);
    }

    public removeGlobalRoom(room: Room) {
        this.allRooms = this.allRooms.filter(
            (element) => element.id !== room.id
        );
    }
}
