import { createContext, ReactNode, useReducer, useState } from "react";
import { useLocalStorage } from "domains/common/hooks";
import { IVideo } from "../@types/video";
import { playlistReducer, socketsReducer } from "../state/reducers/room";
import { ISocket } from "domains/common/@types/socket";

interface IContext {
    showServerMessages: boolean | null;
    setShowServerMessages: React.Dispatch<React.SetStateAction<boolean>>;
    playlist: IVideo[];
    dispatchPlaylist: React.Dispatch<any>;
    sockets: ISocket[];
    dispatchSockets: React.Dispatch<any>;
    activeVideo: IVideo | null;
    setActiveVideo: React.Dispatch<React.SetStateAction<IVideo | null>>;
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
    const [activeVideo, setActiveVideo] = useState<IVideo | null>(null);
    const [sockets, dispatchSockets] = useReducer(socketsReducer, []);

    const values: IContext = {
        showServerMessages,
        setShowServerMessages,
        playlist,
        dispatchPlaylist,
        sockets,
        dispatchSockets,
        activeVideo,
        setActiveVideo,
    };

    return (
        <RoomContext.Provider value={values}>{children}</RoomContext.Provider>
    );
}
