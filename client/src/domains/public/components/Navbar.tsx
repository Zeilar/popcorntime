import { useDisclosure } from "@chakra-ui/hooks";
import { Flex, Link, Text } from "@chakra-ui/layout";
import BrandLogo from "domains/common/components/styles/BrandLogo";
import { useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
import { MeContext } from "../contexts";
import Button from "domains/common/components/styles/button";
import { CreateRoom } from "./modals";
import MdiIcon from "domains/common/components/MdiIcon";
import { useTheme } from "@chakra-ui/system";
import { useMediaQuery } from "@chakra-ui/media-query";
import MobileNavbar from "./MobileNavbar";
import SocketSettings from "./SocketSettings";

export default function Navbar() {
    const { me } = useContext(MeContext);
    const createRoom = useDisclosure();
    const theme = useTheme();
    const [isDesktop] = useMediaQuery(
        `(min-width: ${theme.breakpoints.desktop})`
    );

    if (!isDesktop) {
        return <MobileNavbar />;
    }

    return (
        <Flex
            as="nav"
            boxShadow="elevate.bottom"
            bgColor="gray.800"
            zIndex={1000}
            alignItems="center"
        >
            <CreateRoom
                isOpen={createRoom.isOpen}
                onClose={createRoom.onClose}
            />
            <Link
                px="1rem"
                h="100%"
                display="flex"
                alignItems="center"
                boxShadow="elevate.right"
                to="/"
                as={RouterLink}
                color="inherit"
                _hover={{ textDecor: "none" }}
                _focus={{ boxShadow: "elevate.right" }}
            >
                <BrandLogo />
            </Link>
            <Flex gridGap="0.5rem" p="1rem">
                <Button variant="primary" onClick={createRoom.onOpen}>
                    <MdiIcon path="mdiPlus" mr="0.25rem" />
                    Create room
                </Button>
            </Flex>
            <SocketSettings>
                <Text
                    userSelect="none"
                    display="flex"
                    alignItems="center"
                    h="100%"
                    boxShadow="elevate.left"
                    p="1rem"
                    as="h3"
                    ml="auto"
                    color={`${me?.color}.600`}
                    _hover={{
                        textDecor: "underline",
                        cursor: "pointer",
                    }}
                >
                    {me?.username}
                </Text>
            </SocketSettings>
        </Flex>
    );
}
