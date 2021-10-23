import { WS } from "./WS";
import { Room } from "./Room";

export class Socket extends WS {
    public roomId: string | null;
    public username: string;
    public color: string; // make type Color

    constructor(public readonly id: string) {
        super();
        this.setRandomColor();
        this.setRandomName();
    }

    public get dto() {
        return {
            id: this.id,
            username: this.username,
            color: this.color,
        };
    }

    public join(room: Room | string) {
        if (typeof room === "string") {
            this.roomId = room;
        } else {
            room.addSocket(this);
            this.roomId = room.id;
        }
        return this;
    }

    // If no room is provided, remove the previous room state
    public leave(room?: Room) {
        if (room) {
            room.removeSocket(this);
        } else {
            const room = this.allRooms.find((room) => room.id === this.roomId);
            room?.removeSocket(this);
        }
        this.roomId = null;
        return this;
    }

    public setRandomName() {
        this.username = "some random username";
        return this;
    }

    public setRandomColor() {
        this.color = "some random color";
        return this;
    }
}
