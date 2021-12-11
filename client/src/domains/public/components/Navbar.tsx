import { useDisclosure } from "@chakra-ui/hooks";
import { Flex, Grid, Link, Text } from "@chakra-ui/layout";
import BrandLogo from "domains/common/components/styles/BrandLogo";
import { useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
import { MeContext } from "../contexts";
import Button from "domains/common/components/styles/button";
import { CreateRoom } from "./modals";
import MdiIcon from "domains/common/components/MdiIcon";
import * as Popover from "@chakra-ui/popover";
import { colors } from "data/colors";

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
            >
                <BrandLogo />
            </Link>
            <Flex gridGap="0.5rem" p="1rem">
                <Button variant="primary" onClick={createRoom.onOpen}>
                    <MdiIcon path="mdiPlus" mr="0.25rem" />
                    Create room
                </Button>
            </Flex>
            {me && (
                <Popover.Popover placement="bottom" closeOnBlur={false}>
                    {({ onClose }) => (
                        <>
                            <Popover.PopoverTrigger>
                                <Text
                                    userSelect="none"
                                    display="flex"
                                    alignItems="center"
                                    h="100%"
                                    boxShadow="elevate.left"
                                    p="1rem"
                                    as="h3"
                                    ml="auto"
                                    color={`${me.color}.600`}
                                    _hover={{
                                        textDecor: "underline",
                                        cursor: "pointer",
                                    }}
                                >
                                    {me.username}
                                </Text>
                            </Popover.PopoverTrigger>
                            <Popover.PopoverContent mr="1rem">
                                <Button.Icon
                                    right="0.5rem"
                                    top="0.5rem"
                                    pos="absolute"
                                    mdi="mdiClose"
                                    onClick={onClose}
                                />
                                <Popover.PopoverHeader>
                                    Settings
                                </Popover.PopoverHeader>
                                <Popover.PopoverBody>
                                    <Text mb="0.5rem">Color</Text>
                                    <Grid
                                        gridGap="0.5rem"
                                        gridTemplateColumns={`repeat(${colors.length}, 1.5rem)`}
                                    >
                                        {colors.map(color => (
                                            <Button.Color color={color} />
                                        ))}
                                    </Grid>
                                </Popover.PopoverBody>
                            </Popover.PopoverContent>
                        </>
                    )}
                </Popover.Popover>
            )}
        </Flex>
    );
}
