import { createContext, useState, ReactNode, useEffect } from "react";
import { ISocket } from "../../common/@types/socket";
import { Color } from "../../../common/@types/color";
import { socket } from "../config/socket";

interface IContext {
    me: ISocket;
    setMe: React.Dispatch<React.SetStateAction<ISocket>>;
    changeColor(color: Color): void;
}

interface IProps {
    children: ReactNode;
}

export const MeContext = createContext({} as IContext);

export function MeContextProvider({ children }: IProps) {
    const [me, setMe] = useState<ISocket>({} as ISocket);

    function changeColor(color: Color) {
        setMe((me) => ({ ...me, color }));
    }

    useEffect(() => {
        socket.on("color:update", (color: Color) => {
            changeColor(color);
        });
        return () => {
            socket.off("color:update");
        };
    }, []);

    const values: IContext = {
        me,
        setMe,
        changeColor,
    };

    return <MeContext.Provider value={values}>{children}</MeContext.Provider>;
}