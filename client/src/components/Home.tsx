import { AbsoluteCenter, Box } from "@chakra-ui/layout";
import { useHistory } from "react-router";
import { v4 as uuidv4 } from "uuid";
import { PrimaryButton } from "./styles/button";

export default function Home() {
    const { push } = useHistory();

    function createRoom() {
        push(`/room/${uuidv4()}`);
    }

    return (
        <Box height="100vh">
            <AbsoluteCenter>
                <PrimaryButton onClick={createRoom}>
                    Create new room
                </PrimaryButton>
            </AbsoluteCenter>
        </Box>
    );
}
