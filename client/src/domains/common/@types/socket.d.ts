import { Color } from "../../../common/@types/color";

export interface ISocket {
    id: string;
    username: string;
    color: Color;
    created_at: Date;
}
