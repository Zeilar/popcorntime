import { createContext, ReactNode, useReducer } from "react";
import { ISocket } from "domains/common/@types/socket";
import { socketReducer } from "../state/reducers/socket";
import { IRoom } from "domains/common/@types/room";

interface IContext {
    sockets: ISocket[];
    dispatchSockets: React.Dispatch<any>;
    getSocketsInRoom(room: IRoom): ISocket[];
}

interface IProps {
    children: ReactNode;
}

export const SocketContext = createContext({} as IContext);

export function SocketContextProvider({ children }: IProps) {
    const [sockets, dispatchSockets] = useReducer(socketReducer, []);

    const values: IContext = {
        sockets,
        dispatchSockets,
        getSocketsInRoom,
    };

    function getSocketsInRoom(room: IRoom) {
        return sockets.filter(socket =>
            room.sockets.some(element => element.id === socket.id)
        );
    }

    return (
        <SocketContext.Provider value={values}>
            {children}
        </SocketContext.Provider>
    );
}
