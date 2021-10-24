import { ISocket } from "./socket";

export interface IMessage {
    socket: ISocket;
    body: string;
    created_at: Date;
    id: string;
    notSent?: boolean;
}
