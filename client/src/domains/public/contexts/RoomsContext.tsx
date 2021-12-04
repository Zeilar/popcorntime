import { IRoom } from "domains/common/@types/room";
import { createContext, ReactNode, useReducer } from "react";
import { roomsReducer } from "../state/reducers/rooms";

interface IContext {
    rooms: IRoom[];
    dispatchRooms: React.Dispatch<any>;
}

interface IProps {
    children: ReactNode;
}

export const RoomsContext = createContext({} as IContext);

export function RoomsContextProvider({ children }: IProps) {
    const [rooms, dispatchRooms] = useReducer(roomsReducer, []);

    const values: IContext = {
        rooms,
        dispatchRooms,
    };

    return (
        <RoomsContext.Provider value={values}>{children}</RoomsContext.Provider>
    );
}
