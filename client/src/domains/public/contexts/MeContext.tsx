import {
    createContext,
    useState,
    ReactNode,
    useEffect,
    useContext,
    useCallback,
} from "react";
import { ISocket } from "../../common/@types/socket";
import { Color } from "../../common/@types/color";
import { WebsocketContext } from "domains/public/contexts";

interface IContext {
    me: ISocket | null;
    setMe: React.Dispatch<React.SetStateAction<ISocket | null>>;
    changeColor(color: Color): void;
}

interface IProps {
    children: ReactNode;
}

export const MeContext = createContext({} as IContext);

export function MeContextProvider({ children }: IProps) {
    const [me, setMe] = useState<ISocket | null>(null);
    const { publicSocket } = useContext(WebsocketContext);

    const changeColor = useCallback(
        (color: Color) => {
            if (!me) {
                return;
            }
            setMe(me => ({ ...me!, color }));
        },
        [me]
    );

    useEffect(() => {
        publicSocket.on("socket:update:color", (color: Color) => {
            changeColor(color);
        });
        return () => {
            publicSocket.off("socket:update:color");
        };
    }, [publicSocket, changeColor]);

    useEffect(() => {
        publicSocket.on("connection:success", (socket: ISocket) => {
            setMe(socket);
        });
        return () => {
            publicSocket.off("connection:success");
        };
    }, [publicSocket]);

    const values: IContext = {
        me,
        setMe,
        changeColor,
    };

    return <MeContext.Provider value={values}>{children}</MeContext.Provider>;
}
