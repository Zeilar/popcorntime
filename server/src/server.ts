import "reflect-metadata";
import Logger from "./Logger"; // Load this ASAP to get good logs and error handling registered
import env from "../config/env";
import { join } from "path";
import express, { NextFunction, Request, Response } from "express";
import { Server } from "socket.io";
import cors from "cors";
import { validate } from "uuid";
import { Room } from "./Room";
import { IMessage } from "../@types/message";
import { Socket } from "./Socket";
import { WS } from "./WS";
import { Color } from "../@types/color";
import Message from "./Message";
import { schedule } from "node-cron";
import { RoomPrivacy } from "../@types/room";

const clientPath = join(__dirname, "../../client");
const { PORT, ADMIN_PASSWORD } = env;

export const app = express();
Logger.debug("Initialized Express");

// Global middlewares
app.use(
    express.static(clientPath),
    cors({ origin: "*" }),
    (error: Error, req: Request, res: Response, next: NextFunction) => {
        Logger.error(`${error.message}\n${error.stack}`);
    }
); // TODO: remove cors in production

app.get("/*", (req, res) => {
    res.sendFile(`${clientPath}/index.html`);
});

const server = app.listen(PORT, () => {
    Logger.info(`Running on port ${PORT}`);
});
Logger.debug("Initialized server");

export const io = new Server(server, {
    cors: { origin: "*" }, // TODO: remove cors in production
});
Logger.debug("Connected socket.io to server");

export const adminNamespace = io.of("/admin");
export const publicNamespace = io.of("/public");
export const ws = new WS();

// Runs once every midnight, destroys all empty rooms to make sure server clears memory
schedule("0 0 * * *", () => {
    Logger.info("Deleting stale rooms");
    ws.rooms.forEach(room => {
        if (room.empty()) {
            ws.deleteRoom(room);
        }
    });
});

publicNamespace.on("connection", socket => {
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

        if (body.length > Room.MAX_MESSAGE_LENGTH) {
            return socket.emit("message:error", {
                message: "Failed sending message.",
                reason: `Message is too long. Max ${Room.MAX_MESSAGE_LENGTH} characters.`,
                id,
            });
        }

        room.sendMessage(
            new Message({
                id,
                body,
                socket: _socket.dto,
                roomId: room.id,
            })
        );
    });

    socket.on(
        "room:create",
        (payload: {
            name: string;
            privacy: RoomPrivacy;
            videoId?: string;
            password?: string;
        }) => {
            if ([...ws.rooms].length > env.MAX_ROOMS) {
                return socket.emit("error", {
                    message: "Failed creating room.",
                    reason: "There are too many rooms already, please try again later.",
                });
            }
            const room = new Room({ ...payload });
            socket.emit("room:create", {
                roomId: room.id,
                videoId: room.videoId,
            });
            ws.addRoom(room);
            room.add(_socket);
        }
    );

    socket.on("room:join", (payload: { roomId: string }) => {
        if (!validate(payload.roomId)) {
            return socket.emit("error", {
                message: "Failed joining room.",
                reason: "Invalid room id.",
            });
        }

        const room = ws.rooms.get(payload.roomId);

        if (!room) {
            return socket.emit("error", {
                message: "Failed joining room.",
                reason: "That room does not exist.",
            });
        }

        if (room.id !== payload.roomId) {
            return socket.emit("error", {
                message: "Failed joining room.",
                reason: "Something went wrong.",
            });
        }

        if (room.full()) {
            return socket.emit("error", {
                message: "Failed joining room.",
                reason: "The room is full.",
            });
        }

        _socket.leaveRoom();
        room.add(_socket);
    });

    socket.on("room:video:change", (videoId: string) => {
        const room = _socket.room;

        if (!room) {
            return socket.emit("error", {
                message: "Failed changing video.",
                reason: "You must be in a room to do that.",
            });
        }

        room.changeVideo(_socket, videoId);
    });

    socket.on("rooms:get", () => {
        socket.emit("rooms:get", ws.roomsDto);
    });

    socket.on("video:skip:forward", () => {
        const room = _socket.room;
        if (!room) {
            return socket.emit("error", {
                message: "Failed skipping video forward for room.",
                reason: "You must be in a room to do that.",
            });
        }
        socket.to(room.id).emit("video:skip:forward");
    });

    socket.on("video:skip:backward", () => {
        const room = _socket.room;
        if (!room) {
            return socket.emit("error", {
                message: "Failed skipping video backward for room.",
                reason: "You must be in a room to do that.",
            });
        }
        socket.to(room.id).emit("video:skip:backward");
    });

    socket.on("video:sync", (timestamp: number) => {
        const room = _socket.room;
        if (!room) {
            return socket.emit("error", {
                message: "Failed snycing video for room.",
                reason: "You must be in a room to do that.",
            });
        }
        socket.to(room.id).emit("video:sync", timestamp);
    });

    socket.on("video:play", () => {
        const room = _socket.room;
        if (!room) {
            return socket.emit("error", {
                message: "Failed playing video for room.",
                reason: "You must be in a room to do that.",
            });
        }
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
            return;
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
    const { address } = socket.handshake;
    if (socket.handshake.auth.token === undefined) {
        Logger.info(`${address} connected to admin login.`);
        return next(new Error("Please log in first."));
    } else if (socket.handshake.auth.token !== ADMIN_PASSWORD) {
        Logger.warn(`${address} attempted to login as admin.`);
        return next(new Error("Incorrect token."));
    }
    Logger.info(`${address} logged in as admin.`);
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

        publicNamespace.to(_socket.id).emit("room:kick");
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

        publicNamespace.to(_socket.id).emit("socket:destroy");
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
