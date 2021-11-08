import { IMessage } from "./message";
import { ISocket } from "../../../domains/common/@types/socket";

export interface IRoom {
    id: string;
    name: string;
    sockets: ISocket[];
    messages: IMessage[];
    playlist: string[];
    created_at: Date;
}
