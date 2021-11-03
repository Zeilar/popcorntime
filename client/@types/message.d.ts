import { ISocket } from "./socket";

export interface IMessage {
    id: string;
    body: string;
    socket: ISocket;
    notSent?: boolean;
    created_at: Date;
}
