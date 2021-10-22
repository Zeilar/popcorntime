import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { ISocket } from "../@types/socket";
import { socket } from "./App";

interface IParams {
    roomId: string;
}

export default function Room() {
    const { roomId } = useParams<IParams>();
    const [room, setRoom] = useState<ISocket[]>([]);
    const [user, setUser] = useState<ISocket>();

    useEffect(() => {
        socket.emit("room:join", roomId);
        socket.on("room:update", (sockets: ISocket[]) => {
            console.log({ sockets });
            setRoom(sockets);
            setUser(sockets.find((element) => element.id === socket.id));
        });
        return () => {
            socket.removeAllListeners();
            socket.disconnect();
        };
    }, [roomId]);

    console.log({ room, user });

    return <div>A room {roomId}</div>;
}
