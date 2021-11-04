import "reflect-metadata";
import "dotenv/config";
import "../config/env"; // Runss env check
import { join } from "path";
import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import { validate } from "uuid"; // uuid has no default export
import { Room } from "./Room";
import { IMessage } from "../@types/message";
import { Socket } from "./Socket";
import { WS } from "./WS";
import { Color } from "../@types/color";

const clientPath = join(__dirname, "../../client");
const { PORT, ADMIN_PASSWORD } = process.env;

export const app = express();

// Global middlewares
app.use(express.static(clientPath), cors({ origin: "*" })); // TODO: remove cors in production

app.get("/*", (req, res) => {
    res.sendFile(`${clientPath}\\index.html`);
});

const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

export const io = new Server(server, {
    cors: { origin: "*" }, // TODO: remove cors in production
});
export const adminNamespace = io.of("/admin");
export const ws = new WS();

io.on("connection", async (socket) => {
    const _socket = await new Socket(socket.id).generate();
    ws.addSocket(_socket);
    socket.emit("connection:success", _socket.dto);

    socket.on("socket:update:color", (color: Color) => {
        _socket.setColor(color);
    });

    socket.on("message:send", ({ roomId, body, id }: IMessage) => {
        const room = ws.rooms.get(roomId ?? "");

        if (!room) {
            return socket.emit("message:error", {
                error: "That room does not exist.",
                id,
            });
        }

        if (!room.hasSocket(_socket)) {
            return socket.emit("message:error", {
                error: "You do not belong to that room.",
                id,
            });
        }

        if (!body) {
            return socket.emit("message:error", {
                error: "Invalid message.",
                id,
            });
        }

        if (body.length > 255) {
            return socket.emit("message:error", {
                error: "Message is too long. Max 255 characters.",
                id,
            });
        }

        room.sendMessage(_socket, {
            id,
            body,
            socket: _socket.dto,
            date: new Date(),
        });
    });

    socket.on("room:create", (roomId: string) => {
        if (!validate(roomId)) {
            return socket.emit("error", "Invalid room id.");
        }
        const room = new Room(roomId);
        ws.addRoom(room);
        room.add(_socket);
    });

    socket.on("room:join", (roomId: string) => {
        if (!validate(roomId)) {
            return socket.emit("error", "Invalid room id.");
        }

        const room = ws.rooms.get(roomId);

        if (!room) {
            return socket.emit("error", "That room does not exist.");
        }

        if (room.sockets.length >= Room.MAX_SOCKETS) {
            return socket.emit(
                "error",
                "This room is full. Try again at a later time, or create a new one."
            );
        }

        room.add(_socket);
    });

    socket.on("video:play", () => {
        const room = _socket.room;
        if (!room) {
            return socket.emit("error", "You must join a room to do that.");
        }
        // Make it so the sender gets this at the same time as the others to sync them better.
        io.to(room.id).emit("video:play");
    });

    socket.on("room:leave", (roomId: string) => {
        const room = ws.rooms.get(roomId);
        if (room) {
            room.remove(_socket);
        }
        adminNamespace.emit("room:leave", { roomId, socketId: _socket.id });
    });

    socket.on("disconnect", () => {
        const room = _socket.room;
        // If user was not part of a room when they leave, no need to do anything
        if (room) {
            room.remove(_socket);
        }
        ws.removeSocket(_socket);
    });
});

adminNamespace.use((socket, next) => {
    if (socket.handshake.auth.token !== ADMIN_PASSWORD) {
        return next(new Error("Incorrect token."));
    }
    next();
});
adminNamespace.on("connection", (socket) => {
    const rooms: Room[] = [];
    const sockets: Socket[] = [];
    ws.rooms.forEach((room) => {
        rooms.push(room.dto);
    });
    ws.sockets.forEach((socket) => {
        sockets.push(socket.dto);
    });
    socket.emit("connection:success", {
        rooms,
        sockets,
    });

    socket.on("room:kick", (socketId) => {
        const _socket = ws.sockets.get(socketId);

        if (!_socket) {
            return socket.emit("error", "That socket does not exist.");
        }

        const room = _socket.room;

        if (!room) {
            return socket.emit("error", "Socket does not belong to a room.");
        }

        io.to(_socket.id).emit("room:kick");
        room.remove(_socket);
        socket.emit("room:leave", { roomId: room.id, socketId: _socket.id });
    });

    socket.on("socket:kick", (socketId) => {
        const _socket = ws.sockets.get(socketId);

        if (!_socket) {
            return socket.emit("error", "That socket does not exist.");
        }

        io.to(_socket.id).emit("socket:kick");
        socket.emit("socket:disconnect", socketId);

        _socket.ref?.disconnect();
    });
});
