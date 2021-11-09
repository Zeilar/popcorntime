import { WebsocketContextProvider } from "domains/common/contexts";
import { RoomContextProvider, SocketContextProvider } from "./contexts";
import Router from "./Router";

export default function Admin() {
    return (
        <SocketContextProvider>
            <RoomContextProvider>
                <WebsocketContextProvider>
                    <Router />
                </WebsocketContextProvider>
            </RoomContextProvider>
        </SocketContextProvider>
    );
}
