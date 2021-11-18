import { IMessage } from "./message";
import { ISocketDto } from "./socket";
import { IVideo } from "./video";

export interface IRoomDto {
    id: string;
    messages: IMessage[];
    name: string;
    playlist: IVideo[];
    sockets: string[];
    created_at: Date;
}
