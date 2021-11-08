import { SocketContextProvider } from "domains/common/contexts";
import { RoomContextProvider } from "./contexts";
import Router from "./Router";

export default function Admin() {
    return (
        <RoomContextProvider>
            <SocketContextProvider>
                <Router />
            </SocketContextProvider>
        </RoomContextProvider>
    );
}
