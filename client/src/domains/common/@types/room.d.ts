import { IMessage } from "./message";

export interface IRoomDetails {
    id: string;
    name: string;
    created_at: Date;
    leader: string | null;
}

export interface IRoom extends IRoomDetails {
    sockets: string[];
    messages: IMessage[];
    playlist: string[];
}
