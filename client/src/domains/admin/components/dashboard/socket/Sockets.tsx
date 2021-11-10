import { useDisclosure } from "@chakra-ui/hooks";
import { DeleteIcon } from "@chakra-ui/icons";
import { Flex, Grid, Text } from "@chakra-ui/layout";
import { SocketContext } from "domains/admin/contexts";
import { Prompt } from "domains/common/components/modals";
import Button from "domains/common/components/styles/button";
import { WebsocketContext } from "domains/common/contexts";
import { useContext, useEffect } from "react";
import { toast } from "react-toastify";
import Socket from "./Socket";

export default function Sockets() {
    const { sockets } = useContext(SocketContext);
    const { adminSocket } = useContext(WebsocketContext);
    const prompt = useDisclosure();

    function destroyAll() {
        adminSocket.emit("socket:destroy:all");
    }

    useEffect(() => {
        adminSocket.on("socket:destroy:all", () => {
            toast.success("Destroyed all sockets.");
            prompt.onClose();
        });
        return () => {
            adminSocket.off("socket:destroy:all");
        };
    }, [adminSocket, prompt]);

    return (
        <Flex
            className="custom-scrollbar scrollbar-inset"
            flexDir="column"
            overflowY="auto"
        >
            <Prompt
                onSubmit={destroyAll}
                onClose={prompt.onClose}
                isOpen={prompt.isOpen}
                header="Destroy all sockets"
                body="Are you sure? This cannot be reversed!"
            />
            <Flex
                bgColor="gray.700"
                p="0.5rem"
                boxShadow="md"
                pos="sticky"
                zIndex={50}
                top={0}
            >
                <Button.Primary ml="auto" onClick={prompt.onOpen}>
                    <DeleteIcon mr="0.5rem" />
                    Destroy all
                </Button.Primary>
            </Flex>
            {sockets.length > 0 ? (
                <Grid
                    gridTemplateColumns="repeat(4, 1fr)"
                    gridGap="0.5rem"
                    alignContent="start"
                    p="1rem"
                >
                    {sockets.map((socket) => (
                        <Socket socket={socket} key={socket.id} />
                    ))}
                </Grid>
            ) : (
                <Text p="1rem" as="h2">
                    No sockets were found.
                </Text>
            )}
        </Flex>
    );
}
