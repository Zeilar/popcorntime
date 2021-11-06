import { AbsoluteCenter, Box, Flex, Grid, Text } from "@chakra-ui/layout";
import { IRoom } from "domains/common/@types/room";

interface IProps {
    room: IRoom;
}

export default function Room({ room }: IProps) {
    return (
        <Flex
            bgColor="gray.800"
            rounded="base"
            flexDir="column"
            alignItems="center"
        >
            <Box
                stroke="brand.default"
                pos="relative"
                w="10rem"
                h="10rem"
                p="0.5rem"
            >
                <AbsoluteCenter>
                    <Text fontSize="large" fontWeight={600}>
                        {room.sockets.length} / 10
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
            >
                {room.sockets.map((socket) => (
                    <Text
                        bgGradient={`linear(to-r, ${socket.color}.700, ${socket.color}.800)`}
                        p="0.5rem"
                        bgColor={`${socket.color}.700`}
                        rounded="base"
                        fontWeight={600}
                        key={socket.id}
                    >
                        {socket.username}
                    </Text>
                ))}
            </Grid>
        </Flex>
    );
}
