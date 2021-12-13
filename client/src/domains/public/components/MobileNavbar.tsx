import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Flex, Link } from "@chakra-ui/layout";
import MdiIcon from "domains/common/components/MdiIcon";
import BrandLogo from "domains/common/components/styles/BrandLogo";
import { useState } from "react";
import { NavLink as RouterLink } from "react-router-dom";
import { CreateRoom } from "./modals";
import SocketSettings from "./SocketSettings";

export default function MobileNavbar() {
    const [isOpen, setIsOpen] = useState(false);
    const createRoom = useDisclosure();
    return (
        <Flex
            h="4rem"
            bgColor="gray.800"
            boxShadow="elevate.bottom"
            zIndex={1000}
            as="nav"
            justifyContent="space-between"
            alignItems="center"
        >
            <CreateRoom
                onClose={createRoom.onClose}
                isOpen={createRoom.isOpen}
            />
            <Flex
                boxShadow="elevate.left"
                bgColor="gray.900"
                transition="0.25s"
                maxW="100%"
                pos="fixed"
                right={0}
                top={0}
                transform={`translateX(${isOpen ? "0" : "100%"})`}
                w="15rem"
                h="100vh"
                zIndex={100}
            >
                <Button
                    variant="unstyled"
                    p="1rem"
                    pos="absolute"
                    right={0}
                    top={0}
                >
                    <MdiIcon
                        path="mdiClose"
                        h="2rem"
                        w="2rem"
                        onClick={() => setIsOpen(false)}
                    />
                </Button>
                <Flex ml="auto" mt="5rem" pr="1.5rem" alignItems="flex-start">
                    <Link
                        as={RouterLink}
                        to="/"
                        color="inherit"
                        exact
                        _hover={{ textDecor: "none" }}
                        _activeLink={{ color: "brand.light" }}
                        onClick={() => setIsOpen(false)}
                    >
                        Home
                    </Link>
                </Flex>
            </Flex>
            <Link
                px="1rem"
                to="/"
                as={RouterLink}
                color="inherit"
                _hover={{ textDecor: "none" }}
            >
                <BrandLogo />
            </Link>
            <Flex>
                <Button variant="unstyled" p="1rem" onClick={createRoom.onOpen}>
                    <MdiIcon path="mdiPlus" h="2rem" w="2rem" />
                </Button>
                <SocketSettings>
                    <Button variant="unstyled" p="1rem">
                        <MdiIcon path="mdiCog" h="1.5rem" w="1.5rem" />
                    </Button>
                </SocketSettings>
                <Button
                    variant="unstyled"
                    p="1rem"
                    onClick={() => setIsOpen(true)}
                >
                    <MdiIcon path="mdiMenu" h="2rem" w="2rem" />
                </Button>
            </Flex>
        </Flex>
    );
}
