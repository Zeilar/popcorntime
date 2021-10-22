import { WS } from "./WS";
import { Socket as S } from "socket.io";

export class Socket extends WS {
    private readonly ref: S | undefined;
    public username: string;
    public color: string; // make type Color

    constructor(public readonly socket: string | S) {
        super();
        this.ref = this.allSockets.get(
            typeof socket === "string" ? socket : socket.id
        );
        this.setRandomColor();
        this.setRandomName();
    }

    public get dto() {
        return {
            id: this.ref?.id,
            username: this.username,
            color: this.color,
        };
    }

    public leaveRoom(id: string) {
        console.log("leave", id);
        this.ref?.leave(id);
        return this;
    }

    public leaveAllRooms(ids?: string[]) {
        const rooms = ids ?? this.ref?.rooms ?? [];
        rooms.forEach((room) => {
            this.leaveRoom(room);
        });
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
