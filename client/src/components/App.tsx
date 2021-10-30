import { BrowserRouter, Switch, Route } from "react-router-dom";
import { io } from "socket.io-client";
import { WS_HOST } from "../config/host";
import Home from "./Home";
import Room from "./Room";
import { useContext, useEffect, useState } from "react";
import { ISocket } from "../../@types/socket";
import { toast } from "react-toastify";
import { Spinner } from "@chakra-ui/spinner";
import { AbsoluteCenter } from "@chakra-ui/react";
import { MeContext } from "../contexts";

export const socket = io(WS_HOST);

export default function App() {
    const { me, setMe, changeColor } = useContext(MeContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        socket.on("error", (error: string) => {
            toast.error(error);
        });

        socket.on("connect_failed", (error: any) => {
            console.error(error);
            // TODO: error handling
            toast.error("Something went wrong.");
            setLoading(false);
        });
        socket.on("connect_error", (error: any) => {
            console.error(error);
            // TODO: error handling
            toast.error("Something went wrong.");
            setError(error);
            setLoading(false);
        });
        socket.on("disconnect", (error: string) => {
            console.error(error);
            // TODO: error handling
            toast.error("Something went wrong.");
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
            setError(null);
        });

        return () => {
            socket.removeAllListeners();
        };
    }, [setMe]);

    if (error) {
        return <h1>Oh dear {JSON.stringify(error)}</h1>;
    }

    if (!me || loading) {
        return (
            <AbsoluteCenter>
                <Spinner color="brand" size="xl" />
            </AbsoluteCenter>
        );
    }

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
