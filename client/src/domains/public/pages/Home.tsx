import { AbsoluteCenter, Box, Text } from "@chakra-ui/layout";
import Button from "../components/styles/button";
import { ReactComponent as PopcornIcon } from "../assets/svg/popcorn.svg";
import { Link } from "react-router-dom";

export function Home() {
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
                <Button.Primary>
                    <Link to="/room/new">Create new room</Link>
                </Button.Primary>
            </AbsoluteCenter>
        </Box>
    );
}
