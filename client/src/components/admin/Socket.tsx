import { useState, useEffect, ReactNode } from "react";
import { ISocket } from "../../../@types/socket";
import { adminSocket } from "../App";

interface IProps {
    socket: ISocket;
}

export default function Socket({ socket }: IProps) {
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
