import { Socket } from "./Socket";
import { WS } from "./WS";

export class Room {
    public static readonly MAX_SOCKETS = 10;
    private readonly ws: WS;
    private readonly ref: Set<string>;

    constructor(public readonly id: string) {
        this.ws = new WS();
        this.ref = this.ws.rooms.get(id) ?? new Set<string>();
    }

    public get sockets() {
        const sockets = [...this.ref].map((element) => {
            const socket = this.ws.sockets.get(element);
            return socket ? new Socket(socket.id).dto : null;
        });
        return sockets.filter((socket) => socket !== null);
    }

    public hasSocket(id: string) {
        return this.ref.has(id);
    }
}
