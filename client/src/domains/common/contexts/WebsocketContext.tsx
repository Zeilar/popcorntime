import { createContext, ReactNode } from "react";
import { Socket, io } from "socket.io-client";
import { WS_HOST } from "../config/host";

interface IContext {
    publicSocket: Socket;
    adminSocket: Socket;
    adminLogin: (password: string) => void;
}

interface IProps {
    children: ReactNode;
}

const publicSocket = io(WS_HOST, { reconnection: false });
const adminSocket = io(`${WS_HOST}/admin`, { reconnection: false });

export const WebsocketContext = createContext({} as IContext);

export function WebsocketContextProvider({ children }: IProps) {
    function adminLogin(password: string) {
        adminSocket.auth = {};
        adminSocket.auth.token = password;
        adminSocket.connect();
    }

    const values: IContext = {
        publicSocket,
        adminSocket,
        adminLogin,
    };

    return (
        <WebsocketContext.Provider value={values}>
            {children}
        </WebsocketContext.Provider>
    );
}
