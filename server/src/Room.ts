import { io } from "./server";
import { WS } from "./WS";

export class Room {
    public readonly ws: WS;

    public get sockets() {
        return [...(this.ws.rooms.get(this.id) ?? [])];
    }

    constructor(public readonly id: string) {
        this.ws = new WS(io);
    }

    public get socketsDTO() {
        return this.sockets.map((socket) => {
            const user = this.ws.sockets.get(socket);
            return {
                id: user?.id,
                username: "random unique username",
                color: "random preferably unique color",
            };
        });
    }
}
