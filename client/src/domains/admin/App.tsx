import { RoomContextProvider } from "./contexts";
import Router from "./Router";

export default function Admin() {
    return (
        <RoomContextProvider>
            <Router />
        </RoomContextProvider>
    );
}
