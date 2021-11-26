import {
    RoomContextProvider,
    SocketContextProvider,
    WebsocketContextProvider,
} from "./contexts";
import Router from "./Router";

export default function Admin() {
    return (
        <WebsocketContextProvider>
            <SocketContextProvider>
                <RoomContextProvider>
                    <Router />
                </RoomContextProvider>
            </SocketContextProvider>
        </WebsocketContextProvider>
    );
}
