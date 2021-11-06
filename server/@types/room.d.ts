import { IMessage } from "./message";
import { ISocketDto } from "./socket";

export interface IRoomDto {
    id: string;
    messages: IMessage[];
    playlist: string[];
    sockets: ISocketDto[];
    created_at: Date;
}
