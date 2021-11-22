import { Flex } from "@chakra-ui/layout";
import Button from "domains/common/components/styles/button";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export function Home() {
    return (
        <Flex h="100vh" flexGrow={1} flexDir="column">
            <Navbar />
            <Flex
                flexDir="column"
                alignItems="center"
                justifyContent="center"
                flexGrow={1}
            >
                <Link to="/room/new">
                    <Button.Primary>Create new room</Button.Primary>
                </Link>
            </Flex>
        </Flex>
    );
}
