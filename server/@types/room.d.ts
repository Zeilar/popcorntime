import { IMessage } from "./message";
import { ISocketDto } from "./socket";

export interface IRoomDto {
    id: string;
    messages: IMessage[];
    name: string;
    playlist: string[];
    sockets: string[];
    created_at: Date;
}
