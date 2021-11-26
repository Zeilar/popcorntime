import { WebsocketContextProvider } from "domains/public/contexts";
import { MeContextProvider } from "./contexts";
import Router from "./Router";

export default function Public() {
    return (
        <WebsocketContextProvider>
            <MeContextProvider>
                <Router />
            </MeContextProvider>
        </WebsocketContextProvider>
    );
}
