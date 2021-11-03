import { Socket as S } from "socket.io";
import { adminNamespace, io, ws } from "./server";
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
        return [...ws.rooms.values()].find((room) => room.hasSocket(this));
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
        this.ref?.emit("color:update", color);
        if (this.room) {
            io.to(this.room.id).emit("room:socket:update:color", {
                socketId: this.id,
                color,
            });
        }
        adminNamespace.emit("socket:update:color", color);
    }
}
