import { WS_HOST } from "domains/common/config/host";
import { createContext } from "react";
import { Socket, io } from "socket.io-client";

interface IContext {
    publicSocket: Socket;
}

interface IProps {
    children: React.ReactNode;
}

const publicSocket = io(`${WS_HOST}/public`, { reconnection: false });

export const WebsocketContext = createContext({} as IContext);

export function WebsocketContextProvider({ children }: IProps) {
    const values: IContext = {
        publicSocket,
    };

    return (
        <WebsocketContext.Provider value={values}>
            {children}
        </WebsocketContext.Provider>
    );
}
