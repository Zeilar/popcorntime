import { createContext, useState, ReactNode } from "react";
import { ISocket } from "../../@types/socket";
import { Color } from "../../@types/color";

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

    const values: IContext = {
        me,
        setMe,
        changeColor,
    };

    return <MeContext.Provider value={values}>{children}</MeContext.Provider>;
}
