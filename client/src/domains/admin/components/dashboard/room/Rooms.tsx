import { Flex, Grid } from "@chakra-ui/layout";
import { adminSocket } from "domains/admin/config/socket";
import { IRoom } from "domains/common/@types/room";
import Button from "domains/common/components/styles/button";
import { useEffect } from "react";
import { toast } from "react-toastify";
import Room from "./Room";

interface IProps {
    rooms: IRoom[];
}

export default function Rooms({ rooms }: IProps) {
    function destroyAll() {
        adminSocket.emit("room:delete:all");
    }

    useEffect(() => {
        adminSocket.on("room:delete:all", () => {
            toast.info("Destroyed all rooms.");
        });
        return () => {
            adminSocket.off("room:delete:all");
        };
    }, []);

    return (
        <Flex flexDir="column" p="0.5rem">
            <Flex bgColor="gray.800" p="0.5rem" mb="0.5rem">
                <Button.Primary ml="auto" onClick={destroyAll}>
                    Destroy all
                </Button.Primary>
            </Flex>
            <Grid
                gridTemplateColumns="repeat(4, minmax(20rem, 1fr))"
                gridGap="0.5rem"
                overflowY="auto"
                alignContent="start"
            >
                {rooms.map((room) => (
                    <Room room={room} key={room.id} />
                ))}
            </Grid>
        </Flex>
    );
}
