import { ISocket } from "domains/common/@types/socket";
import { WebsocketContext } from "domains/common/contexts";
import { useContext } from "react";

interface IProps {
    socket: ISocket;
}

export default function Socket({ socket }: IProps) {
    const { adminSocket } = useContext(WebsocketContext);

    function kickFromServer() {
        adminSocket.emit("socket:kick", socket.id);
    }

    function kickFromRoom() {
        adminSocket.emit("room:kick", socket.id);
    }

    return (
        <div>
            <h2>{socket.username}</h2>
            <button onClick={kickFromServer}>Kick from server</button>
            <br />
            <button onClick={kickFromRoom}>Kick from room</button>
        </div>
    );
}
