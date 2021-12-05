import { Route, Switch, useHistory } from "react-router";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as Pages from "./pages";
import { WebsocketContext } from "domains/public/contexts";
import { RoomContextProvider } from "./contexts/RoomContext";
import { IErrorPayload } from "domains/common/@types/listener";
import { useDisclosure } from "@chakra-ui/hooks";
import Modal from "domains/common/components/styles/modal";
import Button from "domains/common/components/styles/button";
import MdiIcon from "domains/common/components/MdiIcon";
import { Flex } from "@chakra-ui/layout";
import Navbar from "./components/Navbar";
import Footer from "domains/common/components/Footer";
import RoomsSidebar from "./components/RoomsSidebar";
import { validate } from "uuid";

export default function Router() {
    const { publicSocket } = useContext(WebsocketContext);
    const [error, setError] = useState<string | null>(null);
    const { push } = useHistory();
    const prompt = useDisclosure();

    function reconnect() {
        setError(null);
        publicSocket.connect();
    }

    useEffect(() => {
        function genericErrorHandler(error: Error) {
            console.error(error);
            setError("Unable to establish a connection.");
        }

        toast.promise(
            new Promise((resolve, reject) => {
                publicSocket.on("connect", () => {
                    resolve(undefined);
                });
                publicSocket.on("error", reject);
            }),
            {
                pending: "Loading",
                success: "Connected",
                error: "Connection refused",
            }
        );

        publicSocket.on("error", (payload: IErrorPayload) => {
            toast.error(`${payload.message}\n${payload.reason}`);
        });
        publicSocket.on("connect", () => {
            setError(null);
        });
        publicSocket.on("connect_failed", genericErrorHandler);
        publicSocket.on("connect_error", genericErrorHandler);
        publicSocket.on("disconnect", error => {
            console.error(error);
            setError("You were disconnected.");
        });
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
            <Modal
                isOpen={Boolean(error)}
                onClose={prompt.onClose}
                blockScrollOnMount
            >
                <Modal.Overlay />
                <Modal.Content>
                    <Modal.Header
                        as={Flex}
                        alignItems="center"
                        justifyContent="center"
                    >
                        <MdiIcon
                            mr="1rem"
                            path="mdiAlertOutline"
                            color="danger"
                            w="3rem"
                            h="3rem"
                        />
                        {error}
                    </Modal.Header>
                    <Modal.Body>
                        <Button variant="primary" onClick={reconnect} w="100%">
                            Reconnect
                        </Button>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
            <Navbar />
            <Flex flexGrow={1} overflow="hidden">
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
