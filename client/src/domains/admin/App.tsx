import { RoomContextProvider, SocketContextProvider } from "./contexts";
import Router from "./Router";

export default function Admin() {
    return (
        <SocketContextProvider>
            <RoomContextProvider>
                <Router />
            </RoomContextProvider>
        </SocketContextProvider>
    );
}
