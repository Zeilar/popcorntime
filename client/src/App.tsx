import { BrowserRouter, Switch, Route } from "react-router-dom";
import { io } from "socket.io-client";
import { HOST } from "./config/host";
import Home from "./Home";
import useSocket from "./hooks/useSocket";
import Room from "./Room";

export const socket = io(HOST);

export default function App() {
    useSocket();
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact>
                    <Home />
                </Route>
                <Route path="/room/:roomId" exact>
                    <Room />
                </Route>
                <Route>404</Route>
            </Switch>
        </BrowserRouter>
    );
}
