import { BrowserRouter, Switch, Route } from "react-router-dom";
import { io } from "socket.io-client";
import { WS_HOST } from "../config/host";
import Home from "./Home";
import Room from "./Room";
import { useEffect, useState } from "react";
import { ISocket } from "../../@types/socket";
import { toast } from "react-toastify";
import { Spinner } from "@chakra-ui/spinner";

export const socket = io(WS_HOST);

export default function App() {
    const [me, setMe] = useState<ISocket>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | undefined>();

    useEffect(() => {
        socket.on("error", (error: string) => {
            toast.error(error);
        });

        socket.on("connect_failed", (error: any) => {
            console.error(error);
            // TODO: error handling
            setLoading(false);
        });
        socket.on("connect_error", (error: any) => {
            console.error(error);
            // TODO: error handling
            setError(error);
            setLoading(false);
        });
        socket.on("disconnect", (error: string) => {
            console.error(error);
            // TODO: error handling
            setError(error);
            setLoading(false);
        });

        socket.on("connection:error", (error: string) => {
            toast.error(error);
            setError(error);
            setLoading(false);
        });

        socket.on("connection:success", (socket: ISocket) => {
            toast.success(`Welcome ${socket.username}`);
            setMe(socket);
            setLoading(false);
        });

        return () => {
            socket.removeAllListeners();
        };
    }, []);

    if (error) {
        return <h1>Oh dear {JSON.stringify(error)}</h1>;
    }

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
