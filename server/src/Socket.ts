import { WS } from "./WS";
import { Socket as S } from "socket.io";

export class Socket {
    private readonly ref: S | undefined;
    private readonly ws: WS;
    public username: string;
    public color: string; // make type Color

    constructor(public readonly socket: string | S) {
        this.ws = new WS();
        this.ref = this.ws.sockets.get(
            typeof socket === "string" ? socket : socket.id
        );
        this.setRandomColor();
        this.setRandomName();
    }

    public get dto() {
        return {
            id: this.ref?.id,
            username: this.username,
            color: this.color,
        };
    }

    public setRandomName() {
        this.username = "some random username";
        return this;
    }

    public setRandomColor() {
        this.color = "some random color";
        return this;
    }
}
