import { MeContext } from "./contexts";
import { Route, Switch } from "react-router";
import Home from "./components/Home";
import Room from "./components/Room";
import { socket } from "./config/socket";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AbsoluteCenter } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import { ISocket } from "../common/@types/socket";

export default function Router() {
    const { me, setMe } = useContext(MeContext);
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
        socket.on("socket:kick", () => {
            console.log("socket kick");
            toast.info("You were kicked from the server.");
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
        <Switch>
            <Route path="/" exact>
                <Home />
            </Route>
            <Route path="/room/:roomId" exact>
                <Room />
            </Route>
            <Route>404</Route>
        </Switch>
    );
}