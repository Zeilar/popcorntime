import { SocketContext } from "domains/common/contexts";
import { useContext, useEffect, useRef } from "react";
import { Redirect } from "react-router";
import { v4 as uuidv4 } from "uuid";

export function CreateRoom() {
    const { publicSocket } = useContext(SocketContext);
    const id = useRef(uuidv4()).current;
    useEffect(() => {
        publicSocket.emit("room:create", id);
    }, [id, publicSocket]);
    return <Redirect to={`/room/${id}`} />;
}
