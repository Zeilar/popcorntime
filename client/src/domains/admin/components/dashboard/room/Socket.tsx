import { Flex, Text } from "@chakra-ui/layout";
import { ISocket } from "domains/common/@types/socket";
import Button from "domains/common/components/styles/button";
import { WebsocketContext } from "domains/common/contexts";
import { useContext } from "react";

interface IProps {
    socket: ISocket;
}

export default function Socket({ socket }: IProps) {
    const { adminSocket } = useContext(WebsocketContext);

    function kick(socketId: string) {
        adminSocket.emit("room:kick", socketId);
    }

    return (
        <Flex
            bgGradient={`linear(to-r, ${socket.color}.700, ${socket.color}.900)`}
            align="center"
            overflow="hidden"
            rounded="base"
            key={socket.id}
            px="1rem"
        >
            <Text
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
                mdi="mdiClose"
            />
        </Flex>
    );
}
