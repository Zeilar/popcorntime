import { createContext, ReactNode, useEffect, useRef } from "react";
import { Socket, io } from "socket.io-client";
import { WS_HOST } from "../config/host";

type SocketRef = React.MutableRefObject<Socket>;

interface IContext {
    publicSocket: SocketRef;
    adminSocket: SocketRef;
    adminLogin: (password: string) => void;
}

interface IProps {
    children: ReactNode;
}

export const SocketContext = createContext({} as IContext);

export function SocketContextProvider({ children }: IProps) {
    const publicSocket = useRef(io(WS_HOST));
    const adminSocket = useRef(io(`${WS_HOST}/admin`));

    useEffect(() => {
        const _publicSocket = publicSocket.current;
        const _adminSocket = adminSocket.current;
        return () => {
            // This should never happen realistically, but if it does, disconnect the user.
            _publicSocket.disconnect();
            _adminSocket.disconnect();
        };
    }, []);

    function adminLogin(password: string) {
        adminSocket.current.auth = {};
        adminSocket.current.auth.token = password;
        adminSocket.current.connect();
    }

    const values: IContext = {
        publicSocket,
        adminSocket,
        adminLogin,
    };

    return (
        <SocketContext.Provider value={values}>
            {children}
        </SocketContext.Provider>
    );
}
