import { createContext, ReactNode, useReducer, useState } from "react";
import { useLocalStorage } from "domains/common/hooks";
import { IVideo } from "../@types/video";
import {
    activeVideoReducer,
    playlistReducer,
    socketsReducer,
} from "../state/reducers/room";
import { ISocket } from "domains/common/@types/socket";

interface IContext {
    showServerMessages: boolean | null;
    setShowServerMessages: React.Dispatch<React.SetStateAction<boolean>>;
    playlist: IVideo[];
    dispatchPlaylist: React.Dispatch<any>;
    sockets: ISocket[];
    dispatchSockets: React.Dispatch<any>;
    activeVideo: number;
    setActiveVideo: React.Dispatch<React.SetStateAction<number>>;
    isPLaylistItemActive(id: string): boolean;
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
    const [activeVideo, setActiveVideo] = useReducer(activeVideoReducer, 0);
    const [playlist, dispatchPlaylist] = useReducer(playlistReducer, []);
    const [sockets, dispatchSockets] = useReducer(socketsReducer, []);

    function isPLaylistItemActive(videoId: string) {
        return (
            playlist.findIndex(video => video.id === videoId) === activeVideo
        );
    }

    const values: IContext = {
        showServerMessages,
        setShowServerMessages,
        playlist,
        dispatchPlaylist,
        sockets,
        dispatchSockets,
        activeVideo,
        setActiveVideo,
        isPLaylistItemActive,
    };

    return (
        <RoomContext.Provider value={values}>{children}</RoomContext.Provider>
    );
}
