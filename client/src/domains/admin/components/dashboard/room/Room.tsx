import { useDisclosure } from "@chakra-ui/hooks";
import { CloseIcon, DeleteIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import { AbsoluteCenter, Box, Flex, Grid, Text } from "@chakra-ui/layout";
import { Tooltip } from "@chakra-ui/tooltip";
import { adminSocket } from "domains/admin/config/socket";
import { IRoom } from "domains/common/@types/room";
import { Prompt } from "domains/common/components/modals";
import Button from "domains/common/components/styles/button";
import InfoModal from "./InfoModal";

interface IProps {
    room: IRoom;
}

const { REACT_APP_ROOM_MAX_SOCKETS } = process.env;

export default function Room({ room }: IProps) {
    const promptDisclosure = useDisclosure();
    const infoDisclosure = useDisclosure();

    const placeholderAmount =
        parseInt(REACT_APP_ROOM_MAX_SOCKETS) - room.sockets.length;

    function kick(socketId: string) {
        adminSocket.emit("room:kick", socketId);
    }

    function destroy() {
        adminSocket.emit("room:destroy", room.id);
    }

    return (
        <Flex
            bgColor="gray.700"
            rounded="base"
            flexDir="column"
            alignItems="center"
            pos="relative"
        >
            <InfoModal
                isOpen={infoDisclosure.isOpen}
                onClose={infoDisclosure.onClose}
                room={room}
            />
            <Prompt
                header="Destroy room"
                body="Are you sure? This cannot be undone!"
                isOpen={promptDisclosure.isOpen}
                onClose={promptDisclosure.onClose}
                onSubmit={destroy}
            />
            <Button.Icon
                pos="absolute"
                right="0.5rem"
                top="0.5rem"
                title="Destroy room"
                onClick={promptDisclosure.onOpen}
                color="red.600"
            >
                <DeleteIcon />
            </Button.Icon>
            <Button.Icon
                pos="absolute"
                right="0.5rem"
                top="3rem"
                title="Info"
                onClick={infoDisclosure.onOpen}
            >
                <InfoOutlineIcon />
            </Button.Icon>
            <Box
                stroke="brand.default"
                pos="relative"
                w="10rem"
                h="10rem"
                p="0.5rem"
            >
                <AbsoluteCenter>
                    <Text fontSize="large" fontWeight={600}>
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
                {room.sockets.map((socket) => (
                    <Flex
                        bgGradient={`linear(to-r, ${socket.color}.700, ${socket.color}.900)`}
                        align="center"
                        key={socket.id}
                        overflow="hidden"
                        rounded="base"
                        p="0.5rem"
                    >
                        <Text
                            fontWeight={600}
                            whiteSpace="nowrap"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            mr="0.5rem"
                        >
                            {socket.username}
                        </Text>
                        <Button.Icon
                            ml="auto"
                            onClick={() => kick(socket.id)}
                            flexShrink={0}
                        >
                            <CloseIcon maxW="100%" maxH="100%" />
                        </Button.Icon>
                    </Flex>
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
        </Flex>
    );
}
