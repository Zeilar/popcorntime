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
        return this.allRooms.find((room) => room.id === this.roomId);
    }

    public join(room: Room) {
        this.ref?.join(room.id);
        room.addSocket(this);
        this.roomId = room.id;
        return this;
    }

    // If no room is provided, remove the previous room state
    public leave(room?: Room) {
        if (room) {
            this.ref?.leave(room.id);
            room.removeSocket(this);
        } else {
            const room = this.allRooms.find((room) => room.id === this.roomId);
            room?.removeSocket(this);
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
