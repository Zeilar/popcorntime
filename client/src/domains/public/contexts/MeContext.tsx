import {
    createContext,
    useState,
    ReactNode,
    useEffect,
    useContext,
} from "react";
import { ISocket } from "../../common/@types/socket";
import { Color } from "../../common/@types/color";
import { WebsocketContext } from "domains/common/contexts";

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
    const { publicSocket } = useContext(WebsocketContext);

    function changeColor(color: Color) {
        setMe(me => ({ ...me, color }));
    }

    useEffect(() => {
        publicSocket.once("connection:success", (socket: ISocket) => {
            setMe(socket);
        });
        publicSocket.on("socket:update:color", (color: Color) => {
            changeColor(color);
        });
        return () => {
            publicSocket.off("socket:update:color").off("connection:success");
        };
    }, [publicSocket]);

    const values: IContext = {
        me,
        setMe,
        changeColor,
    };

    return <MeContext.Provider value={values}>{children}</MeContext.Provider>;
}
