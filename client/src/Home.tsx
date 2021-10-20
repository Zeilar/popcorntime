import { Button } from "@chakra-ui/button";
import { AbsoluteCenter, Box } from "@chakra-ui/layout";
import { useHistory } from "react-router";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
    const { push } = useHistory();

    function createRoom() {
        push(`/room/${uuidv4()}`);
    }

    return (
        <Box height="100vh">
            <AbsoluteCenter>
                <Button variant="solid" onClick={createRoom}>
                    Create new room
                </Button>
            </AbsoluteCenter>
        </Box>
    );
}
