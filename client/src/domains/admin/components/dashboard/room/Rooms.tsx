import { useDisclosure } from "@chakra-ui/hooks";
import { DeleteIcon } from "@chakra-ui/icons";
import { Flex, Grid } from "@chakra-ui/layout";
import { adminSocket } from "domains/admin/config/socket";
import { IRoom } from "domains/common/@types/room";
import { Prompt } from "domains/common/components/modals";
import Button from "domains/common/components/styles/button";
import { useEffect } from "react";
import { toast } from "react-toastify";
import Room from "./Room";

interface IProps {
    rooms: IRoom[];
}

export default function Rooms({ rooms }: IProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    function destroyAll() {
        adminSocket.emit("room:delete:all");
    }

    useEffect(() => {
        adminSocket.on("room:delete:all", () => {
            toast.success("Destroyed all rooms.");
            onClose();
        });
        return () => {
            adminSocket.off("room:delete:all");
        };
    }, [onClose]);

    return (
        <Flex flexDir="column">
            <Prompt
                onSubmit={destroyAll}
                onClose={onClose}
                isOpen={isOpen}
                header="Destroy all rooms"
                body="Are you sure? This cannot be reversed!"
            />
            <Flex bgColor="gray.700" p="0.5rem" boxShadow="md">
                <Button.Primary ml="auto" onClick={onOpen}>
                    <DeleteIcon mr="0.5rem" />
                    Destroy all
                </Button.Primary>
            </Flex>
            <Grid
                gridTemplateColumns="repeat(4, 1fr)"
                gridGap="0.5rem"
                overflowY="auto"
                alignContent="start"
                p="0.5rem"
            >
                {rooms.map((room) => (
                    <Room room={room} key={room.id} />
                ))}
            </Grid>
        </Flex>
    );
}
