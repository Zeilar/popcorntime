import "reflect-metadata";
import "dotenv/config";
import { join } from "path";
import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import { validate, v4 as uuidv4 } from "uuid"; // uuid has no default export

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
        console.log(validate(roomId), roomId);
        if (!validate(roomId)) {
            return socket.emit("error", "Invalid room id.");
        }
        socket.join(roomId);
        console.log(socket.rooms);
    });
});
