import { AbsoluteCenter, Box, Text } from "@chakra-ui/layout";
import { useHistory } from "react-router";
import { v4 as uuidv4 } from "uuid";
import Button from "./styles/button";
import { ReactComponent as PopcornIcon } from "../assets/svg/popcorn.svg";
import { socket } from "../config/socket";

export default function Home() {
    const { push } = useHistory();

    function createRoom() {
        const id = uuidv4();
        socket.emit("room:create", id);
        push(`/room/${id}`);
    }

    return (
        <Box h="100vh">
            <AbsoluteCenter
                fill="brand"
                display="flex"
                flexDir="column"
                alignItems="center"
            >
                <PopcornIcon width="3rem" />
                <Text fontFamily="Poppins" color="brand">
                    Popcorn Time
                </Text>
                <Button.Primary onClick={createRoom}>
                    Create new room
                </Button.Primary>
            </AbsoluteCenter>
        </Box>
    );
}