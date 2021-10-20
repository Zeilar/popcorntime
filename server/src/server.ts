import "reflect-metadata";
import "dotenv/config";
import { join } from "path";
import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import { validate } from "uuid"; // uuid has no default export

const clientPath = join(__dirname, "../../client");
const { PORT } = process.env;

export const app = express();

// Global middlewares
app.use(express.static(clientPath), cors({ origin: "http://localhost:3000" }));

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

    socket.on("join", (roomId: string) => {
        if (!validate(roomId)) {
            return socket.emit("error", "Invalid room id.");
        }

        // for getting random color:
        // filter out the colors that are not picked by anyone in the room and assign a random of those
        // if filter is empty, pick any random

        socket.join(roomId);

        // @ts-ignore
        socket.username = "random unique username";
        // @ts-ignore
        socket.color = "black";

        const socketsInRoom = [...(io.sockets.adapter.rooms.get(roomId) ?? [])];

        // TODO: make this a Set and anonymous names like "Anonymous Crocodile",
        // but the actual name variable does not contain "Anonymous", append that in frontend
        const users = socketsInRoom.map((element) => {
            const user = io.sockets.sockets.get(element);
            return {
                id: user?.id,
                // @ts-ignore
                username: "random unique username",
                // @ts-ignore
                color: "random preferably unique color",
            };
        });

        socket.emit("users", users);
    });
});
