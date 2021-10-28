import { AbsoluteCenter, Box, Text } from "@chakra-ui/layout";
import { useHistory } from "react-router";
import { v4 as uuidv4 } from "uuid";
import { socket } from "./App";
import { PrimaryButton } from "./styles/button";
import { ReactComponent as PopcornIcon } from "../assets/svg/popcorn.svg";

export default function Home() {
    const { push } = useHistory();

    function createRoom() {
        const id = uuidv4();
        socket.emit("room:create", id);
        push(`/room/${id}`);
    }

    return (
        <Box h="100vh">
            <AbsoluteCenter fill="brand">
                <Text fontFamily="Poppins" color="brand">
                    Popcorn Time
                </Text>
                <PopcornIcon />
                <PrimaryButton onClick={createRoom}>
                    Create new room
                </PrimaryButton>
            </AbsoluteCenter>
        </Box>
    );
}
