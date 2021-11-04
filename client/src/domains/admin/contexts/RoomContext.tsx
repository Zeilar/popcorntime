import { createContext, ReactNode, useEffect, useReducer } from "react";
import { IRoom } from "../../common/@types/room";
import { roomReducer } from "../state/reducers/room";

interface IContext {
    rooms: IRoom[];
    dispatchRooms: React.Dispatch<any>;
}

interface IProps {
    children: ReactNode;
}

export const RoomContext = createContext({} as IContext);

export function RoomContextProvider({ children }: IProps) {
    const [rooms, dispatchRooms] = useReducer(roomReducer, []);

    const values: IContext = {
        rooms,
        dispatchRooms,
    };

    return (
        <RoomContext.Provider value={values}>{children}</RoomContext.Provider>
    );
}
