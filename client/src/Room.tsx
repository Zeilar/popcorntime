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
    }, [roomId]);

    return <div>A room {roomId}</div>;
}
