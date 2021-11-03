import { useState, useEffect, ReactNode } from "react";
import { ISocket } from "../../../@types/socket";
import Socket from "./Socket";

interface IProps {
    sockets: ISocket[];
}

export default function Sockets({ sockets }: IProps) {
    return (
        <div>
            {sockets.map((socket) => (
                <Socket socket={socket} key={socket.id} />
            ))}
        </div>
    );
}
