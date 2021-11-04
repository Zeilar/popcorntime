import { MeContextProvider } from "./contexts";
import Router from "./Router";

export default function Public() {
    return (
        <MeContextProvider>
            <Router />
        </MeContextProvider>
    );
}
