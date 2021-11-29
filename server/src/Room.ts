import { IRoomDto, RoomPrivacy } from "../@types/room";
import { adminNamespace, publicNamespace } from "./server";
import { Socket } from "./Socket";
import Message from "./Message";
import env from "../config/env";
import { v4 as uuidv4 } from "uuid";

const { ROOM_MAX_SOCKETS, ROOM_MAX_MESSAGES, ROOM_MAX_PLAYLIST } = env;

export class Room {
    public static readonly MAX_SOCKETS = ROOM_MAX_SOCKETS;
    public static readonly MAX_MESSAGES = ROOM_MAX_MESSAGES;
    public static readonly MAX_PLAYLIST = ROOM_MAX_PLAYLIST;
    public static readonly MAX_MESSAGE_LENGTH = 500;
    private leader: string | null;
    private sockets: Socket[] = [];
    private messages: Message[] = [];
    private created_at: Date;
    public id: string;

    public constructor(
        public readonly name: string,
        public readonly privacy: RoomPrivacy,
        public videoId?: string
    ) {
        this.id = uuidv4();
        this.created_at = new Date();
        this.leader = null;
    }

    public changeVideo(socket: Socket, id: string) {
        if (!this.isLeader(socket.id)) {
            return socket.ref.emit("error", {
                message: "Failed changing video.",
                reason: "You must be the room leader to do that.",
            });
        }
        this.videoId = id;
        publicNamespace.to(this.id).emit("room:video:change", this.videoId);
    }

    public addMessage(message: Message) {
        if (this.messages.length >= Room.MAX_MESSAGES) {
            this.messages.shift();
        }
        this.messages.push(message);
    }

    public empty() {
        return this.sockets.length === 0;
    }

    public full() {
        return this.sockets.length >= Room.MAX_SOCKETS;
    }

    private autoSetLeader() {
        this.leader = this.sockets[0]?.id ?? null;
        if (this.sockets.length > 0) {
            publicNamespace.to(this.id).emit("room:leader:new", this.leader);
        }
        adminNamespace.emit("room:leader:new", this.leader);
    }

    public get dto(): IRoomDto {
        return {
            id: this.id,
            name: this.name,
            leader: this.leader,
            videoId: this.videoId,
            messages: this.messages,
            created_at: this.created_at,
            privacy: this.privacy,
            sockets: this.socketsDto,
        };
    }

    public get socketsDto() {
        return this.sockets.map(socket => socket.dto);
    }

    public isLeader(socketId: string) {
        return this.leader === socketId;
    }

    public hasSocket(socket: Socket) {
        return this.sockets.some(element => element.id === socket.id);
    }

    public add(socket: Socket) {
        if (this.hasSocket(socket)) {
            return;
        }
        this.sockets.push(socket);
        if (!this.leader) {
            this.autoSetLeader();
        }
        socket.ref.join(this.id);
        socket.ref.emit("room:join", this.dto);
        socket.ref.to(this.id).emit("room:socket:join", socket.dto);
        this.sendMessageToAll(
            this.serverMessage({
                socket,
                body: "joined the room",
            })
        );
        adminNamespace.emit("room:join", {
            socketId: socket.id,
            roomId: this.id,
        });
    }

    public serverMessage(args: { socket: Socket; body: string }) {
        return new Message({
            roomId: this.id,
            serverMessage: true,
            socket: args.socket.dto,
            body: args.body,
        });
    }

    public remove(socket: Socket) {
        this.sockets = this.sockets.filter(element => element.id !== socket.id);
        if (this.leader === socket.id || this.sockets.length === 0) {
            this.autoSetLeader();
        }
        socket.ref.leave(this.id);
        socket.ref.emit("room:leave");
        socket.ref.to(this.id).emit("room:socket:leave", socket.dto);
        this.sendMessageToAll(
            this.serverMessage({
                socket,
                body: "left the room",
            })
        );
        adminNamespace.emit("room:leave", {
            socketId: socket.id,
            roomId: this.id,
        });
    }

    public sendMessage(message: Message) {
        this.addMessage(message);
        publicNamespace.to(this.id).emit("message:new", message);
        adminNamespace.emit("message:new", { roomId: this.id, message });
    }

    public sendMessageToAll(message: Message) {
        this.addMessage(message);
        publicNamespace.to(this.id).emit("message:new", message);
        adminNamespace.emit("message:new", { roomId: this.id, message });
    }
}
