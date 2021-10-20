/**
 * This is for rooms the visitor has already joined without closing the app
 * In case they accidentally go back or want to move back and forth between rooms
 */

import { createContext, ReactNode } from "react";
import { IUser } from "../../@types/user";

interface IRoomsContext {
    rooms: IUser[];
}

interface IRoomsContextProviderProps {
    children: ReactNode;
}

export const RoomsContext = createContext({} as IRoomsContext);

export function RoomsContextProvider({ children }: IRoomsContextProviderProps) {
    const values: IRoomsContext = {
        rooms: [],
    };

    return (
        <RoomsContext.Provider value={values}>{children}</RoomsContext.Provider>
    );
}
