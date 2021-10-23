import { Room } from "./Room";
import { Socket as S } from "socket.io";
import { ws } from "./server";

export class Socket {
    public roomId: string | null;
    public username: string;
    public color: string; // make type Color
    public ref: S | undefined;

    constructor(public readonly id: string) {
        this.ref = ws.io.sockets.sockets.get(id);
        this.setRandomColor();
        this.setRandomName();
    }

    public get dto() {
        return {
            id: this.id,
            username: this.username,
            color: this.color,
        };
    }

    public get room() {
        return ws.getRoom(this.roomId);
    }

    public join(room: Room) {
        this.ref?.join(room.id);
        room.addSocket(this);
        this.roomId = room.id;
        return this;
    }

    // If no room is provided, remove the previous room this socket joined
    public leave(room: Room) {
        room.removeSocket(this);
        if (room.sockets.length <= 0) {
            ws.removeGlobalRoom(room);
        }
        this.roomId = null;
        return this;
    }

    public setRandomName() {
        this.username = "some random username";
        return this;
    }

    public setRandomColor() {
        this.color = "some random color";
        return this;
    }
}
