import { useEffect, useRef } from "react";
import { Redirect } from "react-router";
import { v4 as uuidv4 } from "uuid";
import { socket } from "../config/socket";

export function CreateRoom() {
    const id = useRef(uuidv4()).current;
    useEffect(() => {
        socket.emit("room:create", id);
    }, [id]);
    return <Redirect to={`/room/${id}`} />;
}
