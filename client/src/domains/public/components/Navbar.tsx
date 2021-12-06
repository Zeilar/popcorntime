import { useDisclosure } from "@chakra-ui/hooks";
import { Flex, Link, Text } from "@chakra-ui/layout";
import BrandLogo from "domains/common/components/styles/BrandLogo";
import { useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
import { MeContext } from "../contexts";
import Button from "domains/common/components/styles/button";
import { CreateRoom } from "./modals";

export default function Navbar() {
    const { me } = useContext(MeContext);
    const createRoom = useDisclosure();
    return (
        <Flex
            as="nav"
            boxShadow="elevate.bottom"
            bgColor="gray.800"
            zIndex={1000}
            alignItems="center"
            py="0.5rem"
            px="1rem"
        >
            <CreateRoom
                isOpen={createRoom.isOpen}
                onClose={createRoom.onClose}
            />
            <Link
                to="/"
                as={RouterLink}
                mr="1rem"
                color="inherit"
                _hover={{ textDecor: "none" }}
            >
                <BrandLogo />
            </Link>
            <Button variant="secondary" ml="1rem" onClick={createRoom.onOpen}>
                Create room
            </Button>
            {me && (
                <Text as="h3" ml="auto" color={`${me.color}.600`}>
                    {me.username}
                </Text>
            )}
        </Flex>
    );
}
