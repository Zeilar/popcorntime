import { WebsocketContextProvider } from "domains/public/contexts";
import { MeContextProvider } from "./contexts";
import { RoomsContextProvider } from "./contexts/RoomsContext";
import Router from "./Router";

export default function Public() {
    return (
        <WebsocketContextProvider>
            <MeContextProvider>
                <RoomsContextProvider>
                    <Router />
                </RoomsContextProvider>
            </MeContextProvider>
        </WebsocketContextProvider>
    );
}
