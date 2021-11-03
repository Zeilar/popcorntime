import { IMessage } from "../@types/message";
import { io, ws } from "./server";
import { Socket } from "./Socket";
import { Socket as S } from "socket.io";

export class Room {
    public static readonly MAX_SOCKETS = 10;
    public static readonly MAX_MESSAGES = 30;
    public sockets: Socket[] = [];
    public messages: IMessage[] = [];
    public playlist: string[] = ["68ugkg9RePc"]; // YouTube video ids

    constructor(public readonly id: string) {}

    public addMessage(message: IMessage) {
        if (this.messages.length >= Room.MAX_MESSAGES) {
            this.messages.shift();
        }
        this.messages.push(message);
    }

    public get dto() {
        return {
            ...this,
            sockets: this.socketsDto,
        };
    }

    public get socketsDto() {
        return this.sockets.map((socket) => socket.dto);
    }

    public hasSocket(socket: Socket) {
        return this.sockets.some((element) => element.id === socket.id);
    }

    public add(socket: Socket) {
        if (this.hasSocket(socket)) {
            return false;
        }
        this.sockets.push(socket);
    }

    public remove(socket: Socket) {
        this.sockets = this.sockets.filter(
            (element) => element.id !== socket.id
        );
        if (this.sockets.length <= 0) {
            ws.removeRoom(this);
        }
    }

    public sendMessage(socket: S, message: IMessage) {
        socket.to(this.id).emit("message:new", message);
        this.addMessage(message);
    }
}
