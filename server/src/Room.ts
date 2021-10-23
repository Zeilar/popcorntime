import { Socket } from "./Socket";
import { WS } from "./WS";

export class Room extends WS {
    public static readonly MAX_SOCKETS = 10;
    public sockets: Socket[] = [];

    constructor(public readonly id: string) {
        super();
    }

    public get socketsDto() {
        return this.sockets.map((socket) => socket.dto);
    }

    public hasSocket(socket: Socket) {
        return this.sockets.some((element) => element.id === socket.id);
    }

    public sendMessage() {
        return this;
    }

    public addSocket(socket: Socket) {
        if (this.hasSocket(socket)) {
            return false;
        }
        this.sockets.push(socket);
    }

    public removeSocket(socket: Socket) {
        this.sockets = this.sockets.filter(
            (element) => element.id !== socket.id
        );
    }
}
