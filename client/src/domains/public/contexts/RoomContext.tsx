import { createContext, ReactNode, useReducer, useState } from "react";
import { socketsReducer } from "../state/reducers/room";
import { ISocket } from "domains/common/@types/socket";
import { IRoomDetails } from "domains/common/@types/room";

interface IContext {
    sockets: ISocket[];
    dispatchSockets: React.Dispatch<any>;
    room: IRoomDetails | null;
    setRoom: React.Dispatch<React.SetStateAction<IRoomDetails | null>>;
    getLeader(): ISocket | undefined;
    isLeader(socketId: string | null | undefined): boolean | undefined;
    changeVideo(videoId: string): void;
    setLeader(leader: string | null): void;
}

interface IProps {
    children: ReactNode;
}

export const RoomContext = createContext({} as IContext);

export function RoomContextProvider({ children }: IProps) {
    const [sockets, dispatchSockets] = useReducer(socketsReducer, []);
    const [room, setRoom] = useState<IRoomDetails | null>(null);

    function changeVideo(videoId: string) {
        if (room === null) {
            return;
        }
        setRoom(room => ({ ...room!, videoId }));
    }

    function getLeader() {
        return sockets.find(socket => socket.id === room?.leader);
    }

    function setLeader(leader: string | null) {
        if (!room || !leader) {
            return;
        }
        setRoom(room => ({ ...room!, leader }));
    }

    function isLeader(socketId: string | null | undefined) {
        if (typeof socketId !== "string") {
            return false;
        }
        const leader = getLeader();
        return leader && leader.id === socketId;
    }

    const values: IContext = {
        sockets,
        dispatchSockets,
        room,
        setRoom,
        getLeader,
        isLeader,
        changeVideo,
        setLeader,
    };

    return (
        <RoomContext.Provider value={values}>{children}</RoomContext.Provider>
    );
}
