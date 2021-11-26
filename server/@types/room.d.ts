import { IMessage } from "./message";
import { ISocketDto } from "./socket";
import { IVideo } from "./video";

export interface IRoomDto {
    id: string;
    messages: IMessage[];
    name: string;
    leader: string | null;
    playlist: IVideo[];
    sockets: ISocketDto[];
    created_at: Date;
}
