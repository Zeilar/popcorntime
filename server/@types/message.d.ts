import { Socket } from "../src/Socket";
import { ISocketDto } from "./socket";

export interface IMessage {
    roomId: string;
    body: string;
    id: string;
    socket: ISocketDto;
    created_at: Date;
    serverMessage?: boolean;
}
