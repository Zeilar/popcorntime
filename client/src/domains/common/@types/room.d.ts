import { IMessage } from "./message";
import { ISocket } from "../../../domains/common/@types/socket";

export interface IMetaData {
    MAX_MESSAGES: number;
    MAX_SOCKETS: number;
}

export interface IRoom {
    id: string;
    sockets: ISocket[];
    messages: IMessage[];
    playlist: string[];
    created_at: Date;
}
