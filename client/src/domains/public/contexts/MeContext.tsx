import {
    createContext,
    useState,
    ReactNode,
    useEffect,
    useContext,
} from "react";
import { ISocket } from "../../common/@types/socket";
import { Color } from "../../common/@types/color";
import { toast } from "react-toastify";
import { WebsocketContext } from "domains/common/contexts";

interface IContext {
    me: ISocket;
    setMe: React.Dispatch<React.SetStateAction<ISocket>>;
    changeColor(color: Color): void;
    roomId: string | null;
}

interface IProps {
    children: ReactNode;
}

export const MeContext = createContext({} as IContext);

export function MeContextProvider({ children }: IProps) {
    const [me, setMe] = useState<ISocket>({} as ISocket);
    const [roomId, setRoomId] = useState<string | null>(null);
    const { publicSocket } = useContext(WebsocketContext);

    function changeColor(color: Color) {
        setMe(me => ({ ...me, color }));
    }

    console.log({ roomId });

    useEffect(() => {
        publicSocket.once(
            "connection:success",
            (payload: { socket: ISocket; roomId: string | null }) => {
                setMe(payload.socket);
                toast.success(`Welcome ${payload.socket.username}`);
            }
        );
        publicSocket.on("room:join", (payload: { roomId: string }) => {
            setRoomId(payload.roomId);
        });
        publicSocket.on("color:update", (color: Color) => {
            changeColor(color);
        });
        return () => {
            publicSocket
                .off("color:update")
                .off("connection:success")
                .off("room:join");
        };
    }, [publicSocket]);

    const values: IContext = {
        me,
        setMe,
        changeColor,
        roomId,
    };

    return <MeContext.Provider value={values}>{children}</MeContext.Provider>;
}
