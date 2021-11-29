import { IMessage } from "./message";
import { ISocketDto } from "./socket";
import { IVideo } from "./video";

export type RoomPrivacy = "public" | "private";

export interface IRoomDto {
    id: string;
    messages: IMessage[];
    name: string;
    leader: string | null;
    playlist: IVideo[];
    sockets: ISocketDto[];
    privacy: RoomPrivacy;
    created_at: Date;
}
