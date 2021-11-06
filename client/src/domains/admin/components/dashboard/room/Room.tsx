import { CloseIcon, DeleteIcon } from "@chakra-ui/icons";
import { AbsoluteCenter, Box, Flex, Grid, Text } from "@chakra-ui/layout";
import { Tooltip } from "@chakra-ui/tooltip";
import { adminSocket } from "domains/admin/config/socket";
import { IRoom } from "domains/common/@types/room";
import Button from "domains/common/components/styles/button";

interface IProps {
    room: IRoom;
}

const { REACT_APP_ROOM_MAX_SOCKETS } = process.env;

export default function Room({ room }: IProps) {
    const placeholderAmount =
        parseInt(REACT_APP_ROOM_MAX_SOCKETS) - room.sockets.length;

    function kick(socketId: string) {
        adminSocket.emit("room:kick", socketId);
    }

    function destroy() {
        adminSocket.emit("room:delete", room.id);
    }

    return (
        <Flex
            bgColor="gray.800"
            rounded="base"
            flexDir="column"
            alignItems="center"
            pos="relative"
        >
            <Button.Icon
                pos="absolute"
                right="0.5rem"
                top="0.5rem"
                title="Delete room"
                onClick={destroy}
            >
                <DeleteIcon />
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
                    >
                        <Tooltip
                            label={socket.username}
                            placement="top"
                            openDelay={150}
                            bgGradient={`linear(to-r, ${socket.color}.700, ${socket.color}.900)`}
                            color="inherit"
                            fontSize="large"
                        >
                            <Text
                                p="0.5rem"
                                rounded="base"
                                fontWeight={600}
                                whiteSpace="nowrap"
                                overflow="hidden"
                                textOverflow="ellipsis"
                            >
                                {socket.username}
                            </Text>
                        </Tooltip>
                        <Tooltip label="Kick" placement="top">
                            <Flex
                                ml="auto"
                                as="button"
                                w="2rem"
                                h="2rem"
                                onClick={() => kick(socket.id)}
                                pos="relative"
                                justifyContent="center"
                                alignItems="center"
                            >
                                <CloseIcon maxW="100%" maxH="100%" />
                            </Flex>
                        </Tooltip>
                    </Flex>
                ))}
                {Array(placeholderAmount)
                    .fill(null)
                    .map((_, i) => (
                        <Box
                            rounded="base"
                            p="0.5rem"
                            bgColor="gray.900"
                            key={i}
                        />
                    ))}
            </Grid>
        </Flex>
    );
}
