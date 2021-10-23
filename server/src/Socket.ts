import { WS } from "./WS";
import { Room } from "./Room";
import { Socket as S } from "socket.io";

export class Socket extends WS {
    public roomId: string | null;
    public username: string;
    public color: string; // make type Color
    public ref: S | undefined;

    constructor(public readonly id: string) {
        super();
        this.ref = this.io.sockets.sockets.get(id);
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
        return this.getRoom(this.roomId);
    }

    public join(room: Room) {
        this.ref?.join(room.id);
        room.addSocket(this);
        this.roomId = room.id;
        return this;
    }

    // If no room is provided, remove the previous room this socket joined
    public leave(room?: Room) {
        const roomToRemove = room ?? this.getRoom(this.roomId);
        roomToRemove?.removeSocket(this);
        if (roomToRemove) {
            this.ref?.leave(roomToRemove.id);
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
