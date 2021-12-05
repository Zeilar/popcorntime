import { IRoom } from "domains/common/@types/room";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useReducer,
} from "react";
import { WebsocketContext } from ".";
import { RoomsAction } from "../@types/actions";
import { RoomsActions } from "../state/actions/rooms";
import { roomsReducer } from "../state/reducers/rooms";

interface IContext {
    rooms: IRoom[];
    dispatchRooms: React.Dispatch<RoomsAction>;
}

interface IProps {
    children: ReactNode;
}

export const RoomsContext = createContext({} as IContext);

export function RoomsContextProvider({ children }: IProps) {
    const [rooms, dispatchRooms] = useReducer(roomsReducer, []);
    const { publicSocket } = useContext(WebsocketContext);

    const values: IContext = {
        rooms,
        dispatchRooms,
    };

    useEffect(() => {
        publicSocket.on("disconnect", () => {
            dispatchRooms({
                type: RoomsActions.SET_ROOMS,
                rooms: [],
            });
        });
    }, [publicSocket]);

    return (
        <RoomsContext.Provider value={values}>{children}</RoomsContext.Provider>
    );
}
