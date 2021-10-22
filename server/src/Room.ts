import { Socket } from "./Socket";
import { WS } from "./WS";

export class Room extends WS {
    public static readonly MAX_SOCKETS = 10;
    private readonly ref: Set<string>;

    constructor(public readonly id: string) {
        super();
        this.ref = this.allRooms.get(id) ?? new Set<string>();
    }

    public get sockets() {
        const sockets = [...this.ref].map((element) => {
            const socket = this.allSockets.get(element);
            return socket ? new Socket(socket.id).dto : null;
        });
        return sockets.filter((socket) => socket !== null);
    }

    public hasSocket(id: string) {
        return this.ref.has(id);
    }

    public sendMessage() {
        return this;
    }
}
