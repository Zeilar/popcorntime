import { Room } from "./Room";
import { Socket as S } from "socket.io";
import { ws } from "./server";
import { Color } from "../@types/color";
import generate from "@nwlongnecker/adjective-adjective-animal";
import { ISocketDto } from "../@types/socket";
import { colors } from "../data/colors";

export class Socket {
    public username: string;
    public color: Color;
    public ref: S | undefined;

    constructor(public readonly id: string) {
        this.ref = ws.io.sockets.sockets.get(id);
    }

    public get dto(): ISocketDto {
        return {
            id: this.id,
            username: this.username,
            color: this.color,
        };
    }

    public get room() {
        return ws.getRoomBySocketId(this);
    }

    public join(room: Room) {
        this.ref?.join(room.id);
        room.add(this);
    }

    public leave(room: Room) {
        room.remove(this);
        this.ref?.to(room.id).emit("room:socket:leave", this.dto);
    }

    public async generate() {
        this.setRandomColor();
        await this.setRandomName();
        return this;
    }

    private async setRandomName() {
        this.username = await generate({ adjectives: 1, format: "title" });
    }

    private setRandomColor() {
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    public setColor(color: Color) {
        this.color = color;
    }
}
