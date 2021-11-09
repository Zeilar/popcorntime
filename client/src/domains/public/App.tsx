import { SocketContextProvider } from "domains/common/contexts";
import { MeContextProvider } from "./contexts";
import Router from "./Router";

export default function Public() {
    return (
        <SocketContextProvider>
            <MeContextProvider>
                <Router />
            </MeContextProvider>
        </SocketContextProvider>
    );
}
