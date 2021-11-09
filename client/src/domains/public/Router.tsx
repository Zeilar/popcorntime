import { MeContext } from "./contexts";
import { Route, Switch } from "react-router";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AbsoluteCenter } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import * as Pages from "./pages";
import { WebsocketContext } from "domains/common/contexts";

export default function Router() {
    const { me, setMe } = useContext(MeContext);
    const [error, setError] = useState<string | null>(null);
    const { publicSocket } = useContext(WebsocketContext);

    useEffect(() => {
        publicSocket.on("error", (error: string) => {
            toast.error(error);
        });
        publicSocket.on("connect_failed", (error: any) => {
            console.error(error);
            // TODO: error handling
            toast.error("Something went wrong.");
        });
        publicSocket.on("connect_error", (error: any) => {
            console.error(error);
            // TODO: error handling
            toast.error("Something went wrong.");
            setError(error);
        });
        publicSocket.on("disconnect", (error: string) => {
            console.error(error);
            // TODO: error handling
            toast.error("Something went wrong.");
            setError(error);
        });
        publicSocket.on("socket:kick", () => {
            console.log("socket kick");
            toast.info("You were kicked from the server.");
        });
        publicSocket.on("connection:error", (error: string) => {
            toast.error(error);
            setError(error);
        });

        return () => {
            publicSocket.removeAllListeners();
        };
    }, [setMe, publicSocket]);

    if (error) {
        return <h1>Oh dear {JSON.stringify(error)}</h1>;
    }

    if (!me) {
        return (
            <AbsoluteCenter>
                <Spinner color="brand.default" size="xl" />
            </AbsoluteCenter>
        );
    }

    return (
        <Switch>
            <Route path="/room/new" exact>
                <Pages.CreateRoom />
            </Route>
            <Route path="/" exact>
                <Pages.Home />
            </Route>
            <Route path="/room/:roomId" exact>
                <Pages.Room />
            </Route>
            <Route>404</Route>
        </Switch>
    );
}
