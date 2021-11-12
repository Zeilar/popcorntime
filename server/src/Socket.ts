import { Socket as S } from "socket.io";
import { adminNamespace, io, ws } from "./server";
import { Color } from "../@types/color";
import { colors } from "../data/colors";
import { ISocketDto } from "../@types/socket";
import { uniqueNamesGenerator } from "unique-names-generator";
import { nameConfig } from "../config/uniqueNamesGenerator";

export class Socket {
    public username: string;
    public color: Color;
    public ref: S;
    public created_at: Date;

    constructor(public readonly id: string) {
        this.ref = ws.io.sockets.sockets.get(id)!;
        this.created_at = new Date();
        this.generate();
    }

    public get dto(): ISocketDto {
        return {
            id: this.id,
            username: this.username,
            color: this.color,
            created_at: this.created_at,
        };
    }

    public get room() {
        return [...ws.rooms.values()].find((room) => room.hasSocket(this));
    }

    public generate() {
        this.setRandomColor();
        this.setRandomName();
    }

    private async setRandomName() {
        this.username = uniqueNamesGenerator(nameConfig);
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
