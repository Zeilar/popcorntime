import "reflect-metadata";
import "dotenv/config";
import { join } from "path";
import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import { validate } from "uuid"; // uuid has no default export
import { Room } from "./Room";
import { WS } from "./WS";

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

    socket.on("join", (roomId: string | undefined | null) => {
        if (!roomId || !validate(roomId)) {
            return socket.emit("error", "Invalid room id.");
        }

        const room = new Room(roomId);

        // for getting random color:
        // filter out the colors that are not picked by anyone in the room and assign a random of those
        // if filter is empty, pick any random

        socket.join(room.id);

        // @ts-ignore
        socket.username = "random unique username";
        // @ts-ignore
        socket.color = "black";

        // TODO: make sockets a Set and anonymous names like "Anonymous Crocodile",
        // but the actual name variable does not contain "Anonymous", append that in frontend

        socket.emit("room:update", room.socketsDTO);
    });
});
