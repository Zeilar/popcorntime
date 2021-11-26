import { createContext, ReactNode, useReducer, useState } from "react";
import { useLocalStorage } from "domains/common/hooks";
import { IVideo } from "../@types/video";
import { playlistReducer, socketsReducer } from "../state/reducers/room";
import { ISocket } from "domains/common/@types/socket";
import { IRoomDetails } from "domains/common/@types/room";

interface IContext {
    showServerMessages: boolean;
    setShowServerMessages: React.Dispatch<React.SetStateAction<boolean>>;
    playlist: IVideo[];
    dispatchPlaylist: React.Dispatch<any>;
    sockets: ISocket[];
    dispatchSockets: React.Dispatch<any>;
    room: IRoomDetails | null;
    setRoom: React.Dispatch<React.SetStateAction<IRoomDetails>>;
    getLeader(): ISocket | undefined;
    getActiveVideo(): IVideo | undefined;
    isLeader(socketId: string | null | undefined): boolean | undefined;
}

interface IProps {
    children: ReactNode;
}

export const RoomContext = createContext({} as IContext);

export function RoomContextProvider({ children }: IProps) {
    const [showServerMessages, setShowServerMessages] = useLocalStorage(
        "showServerMessages:chat",
        true
    );
    const [playlist, dispatchPlaylist] = useReducer(playlistReducer, []);
    const [sockets, dispatchSockets] = useReducer(socketsReducer, []);
    const [room, setRoom] = useState<IRoomDetails>({} as IRoomDetails);

    function getActiveVideo(): IVideo | undefined {
        return playlist.find(video => video.active);
    }

    function getLeader() {
        return sockets.find(socket => socket.id === room?.leader);
    }

    function isLeader(socketId: string | null | undefined) {
        if (typeof socketId !== "string") {
            return false;
        }
        const leader = getLeader();
        return leader && leader.id === socketId;
    }

    const values: IContext = {
        showServerMessages,
        setShowServerMessages,
        playlist,
        dispatchPlaylist,
        sockets,
        dispatchSockets,
        room,
        setRoom,
        getLeader,
        getActiveVideo,
        isLeader,
    };

    return (
        <RoomContext.Provider value={values}>{children}</RoomContext.Provider>
    );
}
