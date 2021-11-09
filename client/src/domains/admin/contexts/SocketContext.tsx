import { createContext, ReactNode, useReducer } from "react";
import { ISocket } from "domains/common/@types/socket";
import { socketReducer } from "../state/reducers/socket";

interface IContext {
    sockets: ISocket[];
    dispatchSockets: React.Dispatch<any>;
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
    };

    return (
        <SocketContext.Provider value={values}>
            {children}
        </SocketContext.Provider>
    );
}
