import { IMessage } from "./message";
import { ISocket } from "./socket";

export type RoomPrivacy = "public" | "private";

export interface IRoomDetails {
    id: string;
    name: string;
    created_at: Date;
    leader: string | null;
    privacy: RoomPrivacy;
    videoId: string | null;
}

export interface IRoom extends IRoomDetails {
    sockets: ISocket[];
    messages: IMessage[];
}
