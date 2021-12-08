import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useReducer,
    useState,
} from "react";
import { useLocalStorage } from "domains/common/hooks";
import { socketsReducer } from "../state/reducers/room";
import { ISocket } from "domains/common/@types/socket";
import { IRoomDetails } from "domains/common/@types/room";
import { IMessage } from "domains/common/@types/message";
import env from "config/env";
import { WebsocketContext } from ".";
import { RoomActions } from "../state/actions/room";

interface IContext {
    showServerMessages: boolean;
    setShowServerMessages: React.Dispatch<React.SetStateAction<boolean>>;
    sockets: ISocket[];
    dispatchSockets: React.Dispatch<any>;
    room: IRoomDetails | null;
    setRoom: React.Dispatch<React.SetStateAction<IRoomDetails | null>>;
    getLeader(): ISocket | undefined;
    isLeader(socketId: string | null | undefined): boolean | undefined;
    changeVideo(videoId: string): void;
    setLeader(leader: string | null): void;
    messages: IMessage[];
    setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
    addMessage(message: IMessage): void;
    authorized: boolean;
    setAuthorized: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IProps {
    children: ReactNode;
}

export const RoomContext = createContext({} as IContext);

export function RoomContextProvider({ children }: IProps) {
    const { publicSocket } = useContext(WebsocketContext);
    const [showServerMessages, setShowServerMessages] = useLocalStorage(
        "showServerMessages:chat",
        true
    );
    const [sockets, dispatchSockets] = useReducer(socketsReducer, []);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [room, setRoom] = useState<IRoomDetails | null>(null);
    const [authorized, setAuthorized] = useState(false);

    function addMessage(message: IMessage) {
        setMessages(messages => {
            const array = [...messages, message];
            if (array.length > env.ROOM_MAX_MESSAGES) {
                array.shift();
            }
            return array;
        });
    }

    function changeVideo(videoId: string) {
        if (room === null) {
            return;
        }
        setRoom(room => ({ ...room!, videoId }));
    }

    function getLeader() {
        return sockets.find(socket => socket.id === room?.leader);
    }

    function setLeader(leader: string | null) {
        if (!room || !leader) {
            return;
        }
        setRoom(room => ({ ...room!, leader }));
    }

    function isLeader(socketId: string | null | undefined) {
        if (typeof socketId !== "string") {
            return false;
        }
        const leader = getLeader();
        return leader && leader.id === socketId;
    }

    useEffect(() => {
        publicSocket.on("disconnect", () => {
            setRoom(null);
            dispatchSockets({
                type: RoomActions.SET_SOCKETS,
                sockets: [],
            });
            setMessages([]);
        });
    }, [publicSocket]);

    const values: IContext = {
        showServerMessages,
        setShowServerMessages,
        sockets,
        dispatchSockets,
        room,
        setRoom,
        getLeader,
        isLeader,
        changeVideo,
        setLeader,
        messages,
        addMessage,
        setMessages,
        authorized,
        setAuthorized,
    };

    return (
        <RoomContext.Provider value={values}>{children}</RoomContext.Provider>
    );
}
