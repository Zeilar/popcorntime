import { io } from "./server";
import { Socket } from "./Socket";
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
        const sockets = this.sockets.map((socket) => {
            const user = this.ws.sockets.get(socket);
            if (!user) {
                return null;
            }
            return new Socket(
                user.id,
                "random unique username",
                "random preferably unique color"
            );
        });
        return sockets.filter((socket) => socket !== null);
    }
}
