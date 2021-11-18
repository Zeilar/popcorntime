import "reflect-metadata";
import Logger from "./Logger"; // Load this ASAP to get good logs and error handling registered
import env from "../config/env";
import { join } from "path";
import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import { validate } from "uuid";
import { Room } from "./Room";
import { IMessage } from "../@types/message";
import { Socket } from "./Socket";
import { WS } from "./WS";
import { Color } from "../@types/color";
import Message from "./Message";
import { IVideo } from "../@types/video";

const clientPath = join(__dirname, "../../client");
const { PORT, ADMIN_PASSWORD } = env;

export const app = express();

// Global middlewares
app.use(express.static(clientPath), cors({ origin: "*" })); // TODO: remove cors in production

app.get("/*", (req, res) => {
    res.sendFile(`${clientPath}\\index.html`);
});

const server = app.listen(PORT, () => {
    Logger.info(`Running on port ${PORT}`);
});

export const io = new Server(server, {
    cors: { origin: "*" }, // TODO: remove cors in production
});
export const adminNamespace = io.of("/admin");
export const ws = new WS();

io.on("connection", socket => {
    const _socket = new Socket(socket.id);
    ws.addSocket(_socket);
    socket.emit("connection:success", _socket.dto);

    socket.on("socket:update:color", (color: Color) => {
        _socket.setColor(color);
        const room = _socket.room;
        if (room) {
            room.sendMessageToAll(
                new Message({
                    body: `changed their color to ${color}`,
                    socket: _socket.dto,
                    roomId: room.id,
                    serverMessage: true,
                })
            );
        }
    });

    // Sender includes id so that they can create a message on their client immediately, and gray it out if something went wrong
    socket.on("message:send", ({ roomId, body, id }: IMessage) => {
        const room = ws.rooms.get(roomId);

        if (!room) {
            return socket.emit("message:error", {
                message: "Failed sending message.",
                reason: "You must be in a room to do that.",
                id,
            });
        }

        if (!room.hasSocket(_socket)) {
            return socket.emit("message:error", {
                message: "Failed sending message.",
                reason: "You do not belong to that room.",
                id,
            });
        }

        if (!body) {
            return socket.emit("message:error", {
                message: "Invalid message.",
                id,
            });
        }

        if (body.length > 255) {
            return socket.emit("message:error", {
                message: "Failed sending message.",
                reason: "Message is too long. Max 255 characters.",
                id,
            });
        }

        room.sendMessage(
            _socket,
            new Message({
                id,
                body,
                socket: _socket.dto,
                roomId: room.id,
            })
        );
    });

    socket.on("room:create", (roomId: string) => {
        if (!validate(roomId)) {
            return socket.emit("error", {
                message: "Failed creating room.",
                reason: "Invalid room id.",
            });
        }
        if ([...ws.rooms].length > 20) {
            return socket.emit("error", {
                message: "Failed creating room.",
                reason: "There are too many rooms already, please try again later.",
            });
        }
        const room = new Room(roomId);
        ws.addRoom(room);
        room.add(_socket);
    });

    socket.on("room:join", (roomId: string) => {
        if (!validate(roomId)) {
            return socket.emit("room:connection:error", {
                message: "Failed joining room.",
                reason: "Invalid room id.",
            });
        }

        const room = ws.rooms.get(roomId);

        if (!room) {
            return socket.emit("room:connection:error", {
                message: "Failed joining room.",
                reason: "That room does not exist.",
            });
        }

        if (room.sockets.length >= Room.MAX_SOCKETS) {
            return socket.emit("error", {
                message: "Failed joining room.",
                reason: "The room is full. Try again at a later time, or create a new one.",
            });
        }

        room.add(_socket);
    });

    socket.on(
        "room:playlist:add",
        (payload: { roomId: string; video: IVideo }) => {
            const room = ws.rooms.get(payload.roomId);

            if (!room) {
                return socket.emit("error", {
                    message: "Failed adding video to playlist.",
                    reason: "That room does not exist.",
                });
            }

            socket.to(room.id).emit("room:playlist:add", payload.video);
        }
    );

    socket.on("video:play", () => {
        const room = _socket.room;
        if (!room) {
            return socket.emit("error", {
                message: "Failed playing video for room.",
                reason: "You must be in a room to do that.",
            });
        }
        // Make it so the sender gets this at the same time as the others to sync them better.
        socket.to(room.id).emit("video:play");
    });

    socket.on("video:pause", () => {
        const room = _socket.room;
        if (!room) {
            return socket.emit("error", {
                message: "Failed pausing video for room.",
                reason: "You must be in a room to do that.",
            });
        }
        socket.to(room.id).emit("video:pause");
    });

    socket.on("room:leave", () => {
        const room = _socket.room;
        if (!room) {
            return socket.emit("error", {
                message: "Failed leaving room.",
                reason: "You must be in a room to do that.",
            });
        }
        room.remove(_socket);
        adminNamespace.emit("room:leave", {
            roomId: room.id,
            socketId: _socket.id,
        });
    });

    socket.on("disconnect", () => {
        const room = _socket.room;
        if (room) {
            room.remove(_socket);
        }
        ws.deleteSocket(_socket);
    });
});

adminNamespace.use((socket, next) => {
    if (socket.handshake.auth.token !== ADMIN_PASSWORD) {
        return next(new Error("Incorrect token."));
    }
    next();
});

adminNamespace.on("connection", socket => {
    socket.on("data:get", () => {
        socket.emit("data:get", ws.allData);
    });

    socket.on("room:kick", socketId => {
        const _socket = ws.sockets.get(socketId);

        if (!_socket) {
            return socket.emit("error", {
                message: "Failed kicking socket from room.",
                reason: "That socket does not exist.",
            });
        }

        const room = _socket.room;

        if (!room) {
            return socket.emit("error", {
                message: "Failed kicking socket from room.",
                reason: "Socket does not belong to a room.",
            });
        }

        io.to(_socket.id).emit("room:kick");
        room.remove(_socket);
        adminNamespace.emit("room:kick");
    });

    socket.on("socket:destroy", socketId => {
        const _socket = ws.sockets.get(socketId);

        if (!_socket) {
            return socket.emit("error", {
                message: "Failed destroying socket.",
                reason: "That socket does not exist.",
            });
        }

        io.to(_socket.id).emit("socket:destroy");
        socket.emit("socket:disconnect", socketId);

        _socket.ref.disconnect();
    });

    socket.on("room:destroy", (roomId: string) => {
        const room = ws.rooms.get(roomId);

        if (!room) {
            return socket.emit("error", {
                message: "Failed destroying room.",
                reason: "That room does not exist.",
            });
        }

        ws.deleteRoom(room);
    });

    socket.on("room:destroy:all", () => {
        ws.rooms.forEach(room => {
            ws.deleteRoom(room);
        });
        socket.emit("room:destroy:all");
    });

    socket.on("socket:destroy:all", () => {
        ws.sockets.forEach(socket => {
            ws.deleteSocket(socket);
        });
        socket.emit("socket:destroy:all");
    });
});
