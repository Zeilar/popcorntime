import { useEffect } from "react";
import { useParams } from "react-router";
import { socket } from "./App";

interface IParams {
    roomId: string;
}

export default function Room() {
    const { roomId } = useParams<IParams>();

    useEffect(() => {
        socket.emit("join", roomId);
        socket.on("users", (users: object[]) => {
            console.log(users, socket.id);
        });

        return () => {
            socket.removeAllListeners();
        };
    }, [roomId]);

    return <div>A room {roomId}</div>;
}
