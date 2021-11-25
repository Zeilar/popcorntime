import { Flex, Text } from "@chakra-ui/layout";
import { ISocket } from "domains/common/@types/socket";
import MdiIcon from "domains/common/components/MdiIcon";
import { RoomContext } from "domains/public/contexts";
import { useContext } from "react";

interface IProps {
    socket?: ISocket;
    children?: React.ReactNode;
}

export default function ChatName({ socket, children }: IProps) {
    const { isLeader } = useContext(RoomContext);
    if (!socket) {
        return null;
    }
    return (
        <Flex as="span" color={`${socket?.color}.600`} alignItems="center">
            {isLeader(socket.id) && (
                <MdiIcon
                    mr="0.1rem"
                    path="mdiCrownOutline"
                    color="gold"
                    w="1.25rem"
                    h="1.25rem"
                />
            )}
            <Text fontWeight={700} as="span">
                {children ?? socket?.username}
            </Text>
        </Flex>
    );
}
