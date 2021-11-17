import { Flex, FlexProps, Text } from "@chakra-ui/layout";
import { ISocket } from "domains/common/@types/socket";
import Button from "domains/common/components/styles/button";
import { WebsocketContext } from "domains/common/contexts";
import { useContext, useState } from "react";

interface IProps {
    socket: ISocket;
}

export default function Socket({ socket }: IProps) {
    const { adminSocket } = useContext(WebsocketContext);
    const [isLoading, setIsLoading] = useState(false);

    const isLoadingStyles: FlexProps = isLoading
        ? {
              userSelect: "none",
              cursor: "wait",
              opacity: 0.35,
          }
        : {};

    function kick(socketId: string) {
        setIsLoading(true);
        adminSocket.emit("room:kick", socketId);
    }

    return (
        <Flex
            bgGradient={`linear(to-r, ${socket.color}.700, ${socket.color}.900)`}
            align="center"
            overflow="hidden"
            rounded="base"
            key={socket.id}
            p="0.5rem 1rem"
            {...isLoadingStyles}
        >
            <Text
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
                mr="0.5rem"
                pointerEvents={isLoading ? "none" : undefined}
            >
                {socket.username}
            </Text>
            <Button.Icon
                ml="auto"
                onClick={() => kick(socket.id)}
                flexShrink={0}
                pointerEvents={isLoading ? "none" : undefined}
                mdi="mdiClose"
            />
        </Flex>
    );
}
