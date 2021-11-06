import { IMessage } from "../@types/message";
import { adminNamespace, ws } from "./server";
import { Socket } from "./Socket";

const { ROOM_MAX_SOCKETS, ROOM_MAX_MESSAGES } = process.env;

export class Room {
    public static readonly MAX_SOCKETS = parseInt(ROOM_MAX_SOCKETS);
    public static readonly MAX_MESSAGES = parseInt(ROOM_MAX_MESSAGES);
    public sockets: Socket[] = [];
    public messages: IMessage[] = [];
    public playlist: string[] = ["68ugkg9RePc"]; // YouTube video ids
    public created_at: Date;

    constructor(public readonly id: string) {
        this.created_at = new Date();
    }

    public addMessage(message: IMessage) {
        if (this.messages.length >= Room.MAX_MESSAGES) {
            this.messages.shift();
        }
        this.messages.push(message);
    }

    public get dto() {
        return {
            id: this.id,
            playlist: this.playlist,
            messages: this.messages,
            created_at: this.created_at,
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
            return;
        }
        this.sockets.push(socket);
        socket.ref?.join(this.id);
        socket.ref?.emit("room:join", {
            sockets: this.socketsDto,
            messages: this.messages,
            playlist: this.playlist,
        });
        socket.ref?.to(this.id).emit("room:socket:join", socket.dto);
        adminNamespace.emit("room:join", {
            socket: socket.dto,
            roomId: this.id,
        });
    }

    public remove(socket: Socket) {
        this.sockets = this.sockets.filter(
            (element) => element.id !== socket.id
        );
        socket.ref?.leave(this.id);
        socket.ref?.to(this.id).emit("room:socket:leave", socket.dto);
        adminNamespace.emit("room:leave", {
            socketId: socket.id,
            roomId: this.id,
        });
        if (this.sockets.length <= 0) {
            ws.deleteRoom(this);
        }
    }

    public sendMessage(sender: Socket, message: IMessage) {
        this.addMessage(message);
        sender.ref?.to(this.id).emit("message:new", message);
        adminNamespace.emit("message:new", { roomId: this.id, message });
    }
}
