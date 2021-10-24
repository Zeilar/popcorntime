import { BrowserRouter, Switch, Route } from "react-router-dom";
import { io } from "socket.io-client";
import { HOST } from "../config/host";
import Home from "./Home";
import Room from "./Room";
import { useEffect, useState } from "react";
import { ISocket } from "../../@types/socket";
import { toast } from "react-toastify";
import { Spinner } from "@chakra-ui/spinner";

export const socket = io(HOST);

export default function App() {
    const [me, setMe] = useState<ISocket>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        socket.on("error", (error: string) => {
            toast.error(error);
        });

        socket.on("connection:success", (socket: ISocket) => {
            toast.success(`Welcome ${socket.username}`);
            setMe(socket);
            setLoading(false);
        });

        socket.on("connection:error", (error: string) => {
            toast.error(error);
            setLoading(false);
        });

        return () => {
            socket.removeAllListeners();
        };
    }, []);

    if (loading) {
        return <Spinner color="accent" />;
    }

    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact>
                    <Home />
                </Route>
                <Route path="/room/:roomId" exact>
                    <Room me={me!} />
                </Route>
                <Route>404</Route>
            </Switch>
        </BrowserRouter>
    );
}
