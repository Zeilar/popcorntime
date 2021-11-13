import { Flex, Text, TextProps } from "@chakra-ui/layout";
import { Tooltip } from "@chakra-ui/tooltip";
import { ISocket } from "domains/common/@types/socket";

interface IProps extends TextProps {
    socket: ISocket;
}

function abbreviateUsername(username: string) {
    const [adjective, name] = username.split(" ");
    return `${adjective[0]}${name[0]}`;
}

export default function SocketAvatar({ socket, ...props }: IProps) {
    return (
        <Tooltip
            label={socket.username}
            placement="top"
            bgColor={`${socket.color}.600`}
            openDelay={150}
        >
            <Text
                as={Flex}
                alignItems="center"
                justifyContent="center"
                alignSelf="flex-start"
                letterSpacing={1}
                userSelect="none"
                rounded="base"
                p="0.5rem"
                bgColor={`${socket.color}.600`}
                {...props}
            >
                {abbreviateUsername(socket.username)}
            </Text>
        </Tooltip>
    );
}
