import { useDisclosure } from "@chakra-ui/hooks";
import { DeleteIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import {
    AbsoluteCenter,
    Box,
    Flex,
    FlexProps,
    Grid,
    Text,
} from "@chakra-ui/layout";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { SocketContext } from "domains/admin/contexts";
import { IRoom } from "domains/common/@types/room";
import { Prompt } from "domains/common/components/modals";
import Button from "domains/common/components/styles/button";
import { WebsocketContext } from "domains/common/contexts";
import { motion } from "framer-motion";
import { useContext } from "react";
import InfoModal from "./InfoModal";
import Socket from "./Socket";

interface IProps {
    room: IRoom;
}

const { REACT_APP_ROOM_MAX_SOCKETS } = process.env;

export default function Room({ room }: IProps) {
    const destroyPrompt = useDisclosure();
    const infoDisclosure = useDisclosure();
    const maxSockets = parseInt(REACT_APP_ROOM_MAX_SOCKETS);
    const { adminSocket } = useContext(WebsocketContext);
    const socketContext = useContext(SocketContext);

    const sockets = socketContext.getSocketsInRoom(room);

    const Motion = motion<FlexProps>(Flex);

    const placeholderAmount = maxSockets - room.sockets.length;

    function destroy() {
        adminSocket.emit("room:destroy", room.id);
    }

    const isFull = room.sockets.length >= maxSockets;

    return (
        <Motion
            bgColor="gray.700"
            rounded="base"
            flexDir="column"
            alignItems="center"
            pos="relative"
            exit={{ opacity: 0 }}
        >
            <Menu>
                <MenuButton
                    pointerEvents="none"
                    pos="absolute"
                    right="0.5rem"
                    top="0.5rem"
                >
                    <Button.Icon
                        as="div"
                        mdi="mdiDotsVertical"
                        pointerEvents="all"
                    />
                </MenuButton>
                <MenuList>
                    <MenuItem
                        icon={<DeleteIcon color="danger" />}
                        onClick={destroyPrompt.onOpen}
                    >
                        Destroy
                    </MenuItem>
                </MenuList>
            </Menu>
            <InfoModal
                isOpen={infoDisclosure.isOpen}
                onClose={infoDisclosure.onClose}
                room={room}
            />
            <Prompt
                header="Destroy room"
                body="Are you sure? This cannot be undone!"
                isOpen={destroyPrompt.isOpen}
                onClose={destroyPrompt.onClose}
                onSubmit={destroy}
            />
            {isFull && (
                <Text
                    textTransform="uppercase"
                    pos="absolute"
                    left="0.5rem"
                    top="0.5rem"
                    p="0.25rem"
                    rounded="base"
                    bgColor="brand.default"
                    userSelect="none"
                >
                    FULL
                </Text>
            )}
            <Button.Icon
                pos="absolute"
                right="0.5rem"
                top="3rem"
                onClick={infoDisclosure.onOpen}
                tooltip="Details"
                chakra={InfoOutlineIcon}
            />
            <Box
                stroke="brand.default"
                pos="relative"
                w="10rem"
                h="10rem"
                p="1rem"
            >
                <AbsoluteCenter>
                    <Text
                        fontSize="large"
                        fontWeight={600}
                        color={isFull ? "brand.default" : undefined}
                        userSelect="none"
                    >
                        {`${room.sockets.length} / ${REACT_APP_ROOM_MAX_SOCKETS}`}
                    </Text>
                </AbsoluteCenter>
                <svg
                    viewBox="0 0 36 36"
                    strokeLinecap="round"
                    strokeWidth={3}
                    fill="none"
                >
                    <path
                        style={{ transition: "0.5s ease-in-out" }}
                        strokeDasharray={`${room.sockets.length * 10}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                </svg>
            </Box>
            <Grid
                w="100%"
                h="100%"
                gridGap="0.5rem"
                p="0.5rem"
                gridTemplateColumns="repeat(1, 1fr)"
                gridTemplateRows="repeat(10, 1fr)"
            >
                {sockets.map(socket => (
                    <Socket socket={socket} key={socket.id} />
                ))}
                {Array(placeholderAmount)
                    .fill(null)
                    .map((_, i) => (
                        <Box
                            rounded="base"
                            p="0.5rem"
                            bgColor="blackAlpha.300"
                            key={i}
                        />
                    ))}
            </Grid>
        </Motion>
    );
}
