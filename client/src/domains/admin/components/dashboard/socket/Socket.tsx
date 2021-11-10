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

    function destroy() {
        adminSocket.emit("socket:destroy", socket.id);
    }

    function kickFromRoom() {
        adminSocket.emit("room:kick", socket.id);
    }

    return (
        <Flex
            bgGradient={`linear(to-r, ${socket.color}.700, ${socket.color}.900)`}
            align="center"
            p="0.5rem"
            rounded="base"
            overflow="hidden"
        >
            <Text
                overflow="hidden"
                flexGrow={1}
                whiteSpace="nowrap"
                textOverflow="ellipsis"
                mr="0.5rem"
            >
                {socket.username}
            </Text>
            <Button.Icon icon="mdiDotsVertical" />
        </Flex>
    );
}
