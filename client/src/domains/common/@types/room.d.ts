import { IMessage } from "./message";

export interface IRoom {
    id: string;
    name: string;
    sockets: string[];
    messages: IMessage[];
    playlist: string[];
    created_at: Date;
}
