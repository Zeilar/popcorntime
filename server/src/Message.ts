import { v4 as uuidv4 } from "uuid";
import { IMessage } from "../@types/message";
import { ISocketDto } from "../@types/socket";

interface IArgs {
    id?: string;
    body: string;
    roomId: string;
    socket: ISocketDto;
    serverMessage?: boolean;
}

export default class Message implements IMessage {
    public id: string;
    public body: string;
    public socket: ISocketDto;
    public created_at: Date;
    public roomId: string;
    public serverMessage = false;

    public constructor(args: IArgs) {
        this.created_at = new Date();
        this.id = args.id ?? uuidv4();
        this.body = args.body;
        this.socket = args.socket;
        if (args.serverMessage) {
            this.serverMessage = args.serverMessage;
        }
    }
}
