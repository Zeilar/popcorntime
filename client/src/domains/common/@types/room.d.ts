import { IMessage } from "./message";

export interface IRoomDetails {
    id: string;
    name: string;
    created_at: Date;
}

export interface IRoom extends IRoomDetails {
    sockets: string[];
    messages: IMessage[];
    playlist: string[];
    leader: string;
}
