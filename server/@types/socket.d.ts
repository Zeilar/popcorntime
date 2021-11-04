import { Color } from "./color";

export interface ISocketDto {
    id: string;
    color: Color;
    username: string;
    created_at: Date;
}
