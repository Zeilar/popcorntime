import { Route, Switch } from "react-router";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
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
import MdiIcon from "domains/common/components/MdiIcon";
import { Flex } from "@chakra-ui/layout";
import { AnimatePresence } from "framer-motion";

export default function Router() {
    const { publicSocket } = useContext(WebsocketContext);
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
            setError("Unable to establish a connection.");
            setIsLoading(false);
        }

        publicSocket.on("error", (payload: IErrorPayload) => {
            toast.error(`${payload.message}\n${payload.reason}`);
        });
        publicSocket.on("connect", () => {
            setError(null);
            setIsLoading(false);
        });
        publicSocket.on("connect_failed", genericErrorHandler);
        publicSocket.on("connect_error", genericErrorHandler);
        publicSocket.on("disconnect", error => {
            console.error(error);
            toast.error("You were disconnected.");
            setError("You were disconnected.");
            setIsLoading(false);
        });
        return () => {
            publicSocket
                .off("connect_failed")
                .off("connect_error")
                .off("disconnect");
        };
    }, [publicSocket]);

    return (
        <>
            {isLoading && (
                <AnimatePresence>
                    <PageSpinner />
                </AnimatePresence>
            )}
            <Modal
                isOpen={Boolean(error)}
                onClose={prompt.onClose}
                blockScrollOnMount
                closeOnOverlayClick={false}
            >
                <ModalOverlay />
                <ModalContent p="2rem">
                    <ModalHeader as={Flex} alignItems="center" p={0}>
                        <MdiIcon
                            mr="0.5rem"
                            path="mdiAlertOutline"
                            color="danger"
                        />
                        {error}
                    </ModalHeader>
                    <ModalBody p={0} mt="1rem">
                        <Button.Primary onClick={reconnect} w="100%">
                            Reconnect
                        </Button.Primary>
                    </ModalBody>
                </ModalContent>
            </Modal>
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
