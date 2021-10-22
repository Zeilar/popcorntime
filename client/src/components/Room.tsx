import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { ISocket } from "../../@types/socket";
import { socket } from "./App";

interface IParams {
    roomId: string;
}

export default function Room() {
    const { roomId } = useParams<IParams>();
    const [sockets, setSockets] = useState<ISocket[]>([]);

    const me = useMemo(
        () => sockets.find((element) => element.id === socket.id),
        [sockets]
    );

    useEffect(() => {
        socket.emit("room:join", roomId);
        socket.on("room:update", (sockets: ISocket[]) => {
            setSockets(sockets);
        });
        return () => {
            socket.removeAllListeners();
            socket.disconnect();
        };
    }, [roomId]);

    console.log({ sockets, me });

    return <div>A room {roomId}</div>;
}
