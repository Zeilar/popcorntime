import { ToastPromiseParams } from "domains/common/@types/react-toastify";
import { WS_HOST } from "domains/common/config/host";
import { createContext, useRef } from "react";
import { toast } from "react-toastify";
import { Socket, io } from "socket.io-client";

interface IContext {
    publicSocket: Socket;
    connect(params: ToastPromiseParams): void;
}

interface IProps {
    children: React.ReactNode;
}

export const WebsocketContext = createContext({} as IContext);

export function WebsocketContextProvider({ children }: IProps) {
    const publicSocket = useRef(
        io(`${WS_HOST}/public`, { reconnection: false, autoConnect: false })
    ).current;

    function connect(params: ToastPromiseParams) {
        toast.promise(
            new Promise((resolve, reject) => {
                publicSocket.connect();
                publicSocket.on("connect", () => {
                    resolve(true);
                });
                publicSocket.on("connect_failed", reject);
                publicSocket.on("connect_error", reject);
            }),
            params
        );
    }

    const values: IContext = {
        publicSocket,
        connect,
    };

    return (
        <WebsocketContext.Provider value={values}>
            {children}
        </WebsocketContext.Provider>
    );
}
