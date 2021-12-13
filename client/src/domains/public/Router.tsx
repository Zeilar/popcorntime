import { Route, Switch, useHistory } from "react-router";
import { useContext, useEffect } from "react";
import { toast } from "react-toastify";
import * as Pages from "./pages";
import { WebsocketContext } from "domains/public/contexts";
import { RoomContextProvider } from "./contexts/RoomContext";
import { IErrorPayload } from "domains/common/@types/listener";
import { Flex } from "@chakra-ui/layout";
import Navbar from "./components/Navbar";
import Footer from "domains/common/components/Footer";
import RoomsSidebar from "./components/RoomsSidebar";
import { validate } from "uuid";

export default function Router() {
    const { publicSocket, connect } = useContext(WebsocketContext);
    const { push } = useHistory();

    useEffect(() => {
        connect({
            pending: "Connecting to server...",
            success: "Connected to server.",
            error: "Connection to server refused.",
        });
    }, [connect]);

    useEffect(() => {
        publicSocket.on("disconnect", () =>
            connect({
                pending: "Reconnecting to server...",
                success: "Connected to server.",
                error: "Connection to server refused.",
            })
        );
    }, [publicSocket, connect]);

    useEffect(() => {
        function genericErrorHandler() {
            toast.error("Unable to establish a connection.");
        }
        publicSocket.on("error", (payload: IErrorPayload) => {
            toast.error(`${payload.message}\n${payload.reason}`);
        });
        publicSocket.on("connect_failed", genericErrorHandler);
        publicSocket.on("connect_error", genericErrorHandler);
        return () => {
            publicSocket.off("error");
        };
    }, [publicSocket]);

    useEffect(() => {
        publicSocket.on(
            "room:create",
            (payload: { roomId: string; videoId?: string }) => {
                if (!validate(payload.roomId)) {
                    return toast.error("Invalid room id.");
                }
                push(`/room/${payload.roomId}`);
            }
        );
        return () => {
            publicSocket.off("room:create");
        };
    }, [publicSocket, push]);

    return (
        <Flex flexDir="column" flexGrow={1} bgColor="gray.900">
            <Navbar />
            <Flex
                flexGrow={1}
                overflow={[null, "hidden"]}
                flexDir={["column", "row"]}
            >
                <RoomsSidebar />
                <Switch>
                    <Route path="/" exact>
                        <Pages.Home />
                    </Route>
                    <Route path="/watch" exact>
                        <Pages.Watch />
                    </Route>
                    <Route path="/room/:roomId" exact>
                        <RoomContextProvider>
                            <Pages.Room />
                        </RoomContextProvider>
                    </Route>
                    <Route>404</Route>
                </Switch>
            </Flex>
            <Footer />
        </Flex>
    );
}
