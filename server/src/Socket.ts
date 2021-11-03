import { Room } from "./Room";
import { Socket as S } from "socket.io";
import { adminNamespace, ws } from "./server";
import { Color } from "../@types/color";
import generate from "@nwlongnecker/adjective-adjective-animal";
import { colors } from "../data/colors";

export class Socket {
    public username: string;
    public color: Color;
    public ref: S | undefined;

    constructor(public readonly id: string) {
        this.ref = ws.io.sockets.sockets.get(id);
    }

    public get dto() {
        const data = { ...this };
        delete data.ref;
        return data;
    }

    public get room() {
        return ws.getRoomBySocketId(this);
    }

    public join(room: Room) {
        this.ref?.join(room.id);
    }

    public leave(room: Room) {
        this.ref?.to(room.id).emit("room:socket:leave", this.dto);
        this.ref?.leave(room.id);
    }

    public async generate() {
        this.setRandomColor();
        await this.setRandomName();
        return this;
    }

    private async setRandomName() {
        this.username = await generate({ adjectives: 1, format: "title" });
        adminNamespace.emit("socket:update:name", this.username);
    }

    private setRandomColor() {
        this.setColor(colors[Math.floor(Math.random() * colors.length)]);
    }

    public setColor(color: Color) {
        this.color = color;
        adminNamespace.emit("socket:update:color", color);
    }
}
