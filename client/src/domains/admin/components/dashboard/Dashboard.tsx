import { useState, useEffect, useCallback, useReducer } from "react";
import { Route, Switch } from "react-router";
import { toast } from "react-toastify";
import { IRoom } from "../../../common/@types/room";
import { ISocket } from "../../../common/@types/socket";
import { adminSocket } from "../../config/socket";
import {
    ADD_ROOM,
    ADD_ROOMS,
    ADD_SOCKET_TO_ROOM,
    REMOVE_ROOM,
    REMOVE_SOCKET_FROM_ROOM,
} from "../../state/actions/room";
import { roomReducer } from "../../state/reducers/room";
import Rooms from "./Rooms";
import Sockets from "./Sockets";

export default function Dashboard() {
    const [sockets, setSockets] = useState<ISocket[]>([]);
    const [rooms, dispatchRooms] = useReducer(roomReducer, []);

    const removeSocketFromRoom = useCallback(
        (socketId: string, roomId: string) => {
            dispatchRooms({ type: REMOVE_SOCKET_FROM_ROOM, roomId, socketId });
        },
        []
    );

    const addSocketToRoom = useCallback((socket: ISocket, roomId: string) => {
        dispatchRooms({ type: ADD_SOCKET_TO_ROOM, socket, roomId });
    }, []);

    console.log(rooms);

    useEffect(() => {
        adminSocket.on("error", (message: string) => {
            toast.error(message);
        });
        adminSocket.on("connect_error", (error) => {
            toast.error(error.message);
        });
        adminSocket.once(
            "connection:success",
            (data: { rooms: IRoom[]; sockets: ISocket[] }) => {
                dispatchRooms({ type: ADD_ROOMS, rooms: data.rooms });
                setSockets(data.sockets);
            }
        );
        adminSocket.on(
            "room:kick",
            (payload: { roomId: string; socketId: string }) => {
                removeSocketFromRoom(payload.socketId, payload.roomId);
                toast.info("Removed socket.");
            }
        );
        adminSocket.on("room:new", (room: IRoom) => {
            dispatchRooms({ type: ADD_ROOM, room });
        });
        adminSocket.on("room:delete", (roomId: string) => {
            dispatchRooms({ type: REMOVE_ROOM, roomId });
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
                addSocketToRoom(payload.socket, payload.roomId);
            }
        );
        adminSocket.on(
            "room:leave",
            (payload: { socketId: string; roomId: string }) => {
                removeSocketFromRoom(payload.socketId, payload.roomId);
            }
        );
        return () => {
            adminSocket.removeAllListeners();
        };
    }, [removeSocketFromRoom, addSocketToRoom]);

    return (
        <div>
            Admin stuff
            <Switch>
                <Route path="/admin" exact>
                    Main
                </Route>
                <Route path="/admin/rooms" exact>
                    <Rooms rooms={rooms} />;
                </Route>
                <Route path="/admin/sockets" exact>
                    <Sockets sockets={sockets} />
                </Route>
                <Route>404</Route>
            </Switch>
        </div>
    );
}
