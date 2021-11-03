import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { IRoom } from "../../@types/room";
import { ISocket } from "../../@types/socket";
import { adminSocket } from "./App";

export default function Admin() {
    const [rooms, setRooms] = useState<IRoom[]>([]);
    const [sockets, setSockets] = useState<ISocket[]>([]);

    function modifyRoom(roomId: string, cb: (room: IRoom) => IRoom) {
        setRooms((rooms) =>
            rooms.map((room) => {
                if (room.id !== roomId) {
                    return room;
                }
                return cb(room);
            })
        );
    }

    useEffect(() => {
        adminSocket.once(
            "connection:success",
            (data: { rooms: IRoom[]; sockets: ISocket[] }) => {
                setRooms(data.rooms);
                setSockets(data.sockets);
            }
        );
        adminSocket.on("room:new", (room: IRoom) => {
            console.log("room:new", room);
            setRooms((rooms) => [...rooms, room]);
        });
        adminSocket.on("room:delete", (roomId: string) => {
            setRooms((rooms) => rooms.filter((room) => room.id !== roomId));
        });
        adminSocket.on("socket:connect", (socket: ISocket) => {
            setSockets((sockets) => [...sockets, socket]);
        });
        adminSocket.on("socket:disconnect", (socketId: string) => {
            setSockets((sockets) =>
                sockets.filter((socket) => socket.id !== socketId)
            );
        });
        adminSocket.on(
            "room:join",
            (payload: { socket: ISocket; roomId: string }) => {
                modifyRoom(payload.roomId, (room) => ({
                    ...room,
                    sockets: [...room.sockets, payload.socket],
                }));
            }
        );
        adminSocket.on(
            "room:leave",
            (payload: { socketId: string; roomId: string }) => {
                modifyRoom(payload.roomId, (room) => ({
                    ...room,
                    sockets: room.sockets.filter(
                        (socket) => socket.id !== payload.socketId
                    ),
                }));
            }
        );
        adminSocket.on("connect_error", (error) => {
            toast.error(error.message);
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
