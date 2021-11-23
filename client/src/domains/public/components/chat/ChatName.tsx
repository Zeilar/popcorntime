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
    const { getLeader } = useContext(RoomContext);
    const isLeader = getLeader()?.id === socket?.id;
    return (
        <Flex as="span" color={`${socket?.color}.600`} alignItems="center">
            {isLeader && (
                <MdiIcon
                    mr="0.1rem"
                    path="mdiCrownOutline"
                    color="gold"
                    w="1.25rem"
                    h="1.25rem"
                />
            )}
            <Text fontWeight={700}>{children ?? socket?.username}</Text>
        </Flex>
    );
}
