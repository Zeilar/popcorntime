import { Color } from "./color";

export interface ISocket {
    id: string;
    username: string;
    color: Color;
    created_at: Date;
}
