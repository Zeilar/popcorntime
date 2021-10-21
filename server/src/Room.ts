import { io } from "./server";
import { WS } from "./WS";

const ws = new WS(io);

export class Room {
    public get sockets() {
        return [...(ws.rooms.get(this.id) ?? [])];
    }

    constructor(public readonly id: string) {}

    public get socketsDTO() {
        return this.sockets.map((socket) => {
            const user = ws.sockets.get(socket);
            return {
                id: user?.id,
                username: "random unique username",
                color: "random preferably unique color",
            };
        });
    }
}
