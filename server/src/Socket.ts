import { Room } from "./Room";
import { Socket as S } from "socket.io";
import { ws } from "./server";
import { Color } from "../@types/color";
import generate from "@nwlongnecker/adjective-adjective-animal";
import { ISocketDto } from "../@types/socket";

console.log(generate);

export class Socket {
    public roomId: string | null;
    public username: string;
    public color: Color;
    public ref: S | undefined;

    constructor(public readonly id: string) {
        this.ref = ws.io.sockets.sockets.get(id);
        this.setRandomColor();
        this.setRandomName();
    }

    public get dto(): ISocketDto {
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
        room.add(this);
        this.roomId = room.id;
        return this;
    }

    public leave(room: Room) {
        room.remove(this);
        if (room.sockets.length <= 0) {
            ws.removeRoom(room);
        }
        this.roomId = null;
        return this;
    }

    private setRandomName() {
        this.username = "some random username";
        return this;
    }

    private setRandomColor() {
        this.color = "some random color";
        return this;
    }
}
