import { useState, useEffect } from "react";
import { IRoom } from "../../@types/room";
import { ISocket } from "../../@types/socket";
import { adminSocket } from "./App";

// const socket = io(`${WS_HOST}/admin`);

// setInterval(() => {
//     console.log(socket);
// }, 2500);

export default function Admin() {
    const [rooms, setRooms] = useState<IRoom[]>([]);
    const [sockets, setSockets] = useState<ISocket[]>([]);

    useEffect(() => {
        adminSocket.once(
            "connection:success",
            (data: { rooms: IRoom[]; sockets: ISocket[] }) => {
                console.log("connected", data);
                setRooms(data.rooms);
                setSockets(data.sockets);
            }
        );
        adminSocket.on("room:new", (room: IRoom) => {
            setRooms((rooms) => [...rooms, room]);
        });
        adminSocket.on("socket:connect", (socket: ISocket) => {
            setSockets((sockets) => [...sockets, socket]);
        });
        adminSocket.on("socket:disconnect", (socketId: string) => {
            setSockets((sockets) =>
                sockets.filter((socket) => socket.id !== socketId)
            );
        });
        return () => {
            adminSocket.removeAllListeners();
        };
    }, []);

    return (
        <div>
            Admin stuff
            <pre>rooms {JSON.stringify(rooms, null, 4)}</pre>
            <pre>sockets {JSON.stringify(sockets, null, 4)}</pre>
        </div>
    );
}
