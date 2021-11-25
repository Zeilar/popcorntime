import { MeContext } from "./contexts";
import { Route, Switch } from "react-router";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AbsoluteCenter, Flex, Text } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import * as Pages from "./pages";
import { WebsocketContext } from "domains/common/contexts";
import { RoomContextProvider } from "./contexts/RoomContext";
import { IErrorPayload } from "domains/common/@types/listener";
import { useDisclosure } from "@chakra-ui/hooks";
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
} from "@chakra-ui/modal";
import Button from "domains/common/components/styles/button";
import PageSpinner from "domains/common/components/styles/PageSpinner";

export default function Router() {
    const { me } = useContext(MeContext);
    const { publicSocket } = useContext(WebsocketContext);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const prompt = useDisclosure();

    function reconnect() {
        setError(null);
        setIsLoading(true);
        publicSocket.connect();
    }

    useEffect(() => {
        function genericErrorHandler(error: Error) {
            console.error(error);
            toast.error("Something went wrong.");
            setError("Could not connect.");
            setIsConnected(false);
            setIsLoading(false);
        }

        publicSocket.on("error", (payload: IErrorPayload) => {
            toast.error(`${payload.message}\n${payload.reason}`);
        });
        publicSocket.on("connect", () => {
            setError(null);
            setIsConnected(true);
            setIsLoading(false);
        });
        publicSocket.on("connect_failed", genericErrorHandler);
        publicSocket.on("connect_error", genericErrorHandler);
        publicSocket.on("disconnect", (error: string) => {
            console.error(error);
            toast.error("Something went wrong.");
            setError("You have been disconnected.");
            setIsLoading(false);
        });
    }, [publicSocket]);

    return (
        <>
            {isLoading && <PageSpinner />}
            {error && (
                <Modal isOpen onClose={prompt.onClose} blockScrollOnMount>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Reconnect</ModalHeader>
                        <ModalBody>
                            <Button.Primary onClick={reconnect}>
                                Reconnect
                            </Button.Primary>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            )}
            <Switch>
                <Route path="/room/new" exact>
                    <Pages.CreateRoom />
                </Route>
                <Route path="/" exact>
                    <Pages.Home />
                </Route>
                <Route path="/room/:roomId" exact>
                    <RoomContextProvider>
                        <Pages.Room />
                    </RoomContextProvider>
                </Route>
                <Route>404</Route>
            </Switch>
        </>
    );
}
