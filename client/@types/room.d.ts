import { IMessage } from "./message";
import { ISocket } from "./socket";

export interface IMetaData {
    MAX_MESSAGES: number;
    MAX_SOCKETS: number;
}

export interface IRoom {
    id: string;
    sockets: ISocket[];
    messages: IMessage[];
    playlist: string[];
}
