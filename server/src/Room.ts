import { io } from "./server";
import { Socket } from "./Socket";

export class Room {
    public static readonly MAX_SOCKETS = 10;
    public sockets: Socket[] = [];
    public ref: Set<string> | undefined;

    constructor(public readonly id: string) {
        this.ref = io.sockets.adapter.rooms.get(id);
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
    }
}
