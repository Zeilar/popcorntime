import { useDisclosure } from "@chakra-ui/hooks";
import { DeleteIcon } from "@chakra-ui/icons";
import { Flex, Grid, Text } from "@chakra-ui/layout";
import { RoomContext } from "domains/admin/contexts";
import { Prompt } from "domains/common/components/modals";
import Button from "domains/common/components/styles/button";
import { WebsocketContext } from "domains/common/contexts";
import { useContext, useEffect } from "react";
import { toast } from "react-toastify";
import Room from "./Room";

export default function Rooms() {
    const { adminSocket } = useContext(WebsocketContext);
    const prompt = useDisclosure();
    const { rooms } = useContext(RoomContext);

    function destroyAll() {
        adminSocket.emit("room:destroy:all");
    }

    useEffect(() => {
        adminSocket.on("room:destroy:all", () => {
            toast.success("Destroyed all rooms.");
            prompt.onClose();
        });
        return () => {
            adminSocket.off("room:destroy:all");
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
                header="Destroy all rooms"
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
            {rooms.length > 0 ? (
                <Grid
                    gridTemplateColumns="repeat(6, 1fr)"
                    gridGap="0.5rem"
                    alignContent="start"
                    p="1rem"
                >
                    {rooms.map(room => (
                        <Room room={room} key={room.id} />
                    ))}
                </Grid>
            ) : (
                <Text p="1rem" as="h2">
                    No rooms were found.
                </Text>
            )}
        </Flex>
    );
}
