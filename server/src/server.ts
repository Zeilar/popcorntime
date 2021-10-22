import "reflect-metadata";
import "dotenv/config";
import { join } from "path";
import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import { validate, v4 as uuidv4 } from "uuid"; // uuid has no default export
import { Room } from "./Room";
import { IMessage } from "../@types/message";
import { Socket } from "./Socket";

const clientPath = join(__dirname, "../../client");
const { PORT } = process.env;

export const app = express();

// Global middlewares
app.use(express.static(clientPath), cors({ origin: "http://localhost:3000" })); // TODO: remove cors in production

app.get("/*", (req, res) => {
    res.sendFile(`${clientPath}\\index.html`);
});

const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

export const io = new Server(server, {
    cors: { origin: "http://localhost:3000" }, // TODO: remove cors in production
});

io.on("connection", (socket) => {
    socket.leave(socket.id);

    socket.on("message:send", ({ roomId, body }: IMessage) => {
        const room = new Room(roomId);

        if (!room.hasSocket(socket.id)) {
            return socket.emit("error", "You do not belong to that room.");
        }

        if (!body) {
            return socket.emit("error", "Invalid message.");
        }

        io.to(room.id).emit("message:new", {
            body,
            id: uuidv4(),
            date: new Date(),
            socket: new Socket(socket).dto,
        });
    });

    socket.on("room:join", (roomId: string) => {
        if (!validate(roomId)) {
            return socket.emit("error", "Invalid room id.");
        }

        const room = new Room(roomId);

        if (room.sockets.length >= Room.MAX_SOCKETS) {
            return socket.emit(
                "error",
                "This room is full. Try again at a later time."
            );
        }

        // for getting random color:
        // filter out the colors that are not picked by anyone in the room and assign a random of those
        // if filter is empty, pick any random

        socket.join(room.id);

        // TODO: make sockets anonymous names like "Anonymous Crocodile",
        // but the actual name variable does not contain "Anonymous", append that in frontend

        socket.to(room.id).emit("room:update:socket", room.socketsDTO);
    });
});
