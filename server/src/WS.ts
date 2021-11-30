import { Server } from "socket.io";
import { Color } from "../@types/color";
import { IRoomDto } from "../@types/room";
import { ISocketDto } from "../@types/socket";
import Logger from "./Logger";
import { Room } from "./Room";
import { adminNamespace, io, publicNamespace } from "./server";
import { Socket } from "./Socket";

const pickedColors: Record<Color, number> = {
    cyan: 0,
    green: 0,
    orange: 0,
    pink: 0,
    purple: 0,
    yellow: 0,
    teal: 0,
    red: 0,
};

export class WS {
    public sockets: Map<string, Socket> = new Map();
    public rooms: Map<string, Room> = new Map();
    public io: Server;
    public readonly pickedColors = pickedColors;

    constructor() {
        this.io = io;
    }

    public get leastPickedColors() {
        const min = Math.min(...Object.values(this.pickedColors));
        const keys = Object.keys(this.pickedColors) as Color[]; // Since Object.keys() returns string[] this assertion is needed
        return keys.filter(color => this.pickedColors[color] === min);
    }

    public get roomsDto() {
        const rooms: IRoomDto[] = [];
        this.rooms.forEach(room => {
            rooms.push(room.dto);
        });
        return rooms;
    }

    public get publicRoomsDto() {
        const rooms: IRoomDto[] = [];
        this.rooms.forEach(room => {
            if (room.isPublic) {
                rooms.push(room.dto);
            }
        });
        return rooms;
    }

    public get allData() {
        const rooms: IRoomDto[] = [];
        const sockets: ISocketDto[] = [];
        this.rooms.forEach(room => {
            rooms.push(room.dto);
        });
        this.sockets.forEach(socket => {
            sockets.push(socket.dto);
        });
        return { rooms, sockets };
    }

    public addSocket(socket: Socket) {
        this.sockets.set(socket.id, socket);
        this.pickedColors[socket.color] += 1;
        adminNamespace.emit("socket:connect", socket.dto);
        Logger.info(`Added socket ${socket.username}`);
    }

    public deleteSocket(socket: Socket) {
        this.sockets.delete(socket.id);
        this.pickedColors[socket.color] -= 1;
        adminNamespace.emit("socket:disconnect", socket.id);
        Logger.info(`Deleted socket ${socket.username}`);
    }

    public addRoom(room: Room) {
        this.rooms.set(room.id, room);
        if (room.isPublic) {
            publicNamespace.emit("rooms:new", room.dto);
        }
        adminNamespace.emit("room:new", room.dto);
        Logger.info(`Added room ${room.name}`);
    }

    public deleteRoom(room: Room) {
        this.io.to(room.id).emit("room:destroy");
        publicNamespace.emit("rooms:destroy", room.id);
        adminNamespace.emit("room:destroy", room.id);
        this.rooms.delete(room.id);
        Logger.info(`Deleted room ${room.name}`);
    }
}
