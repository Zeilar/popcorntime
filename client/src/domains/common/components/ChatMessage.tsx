import { Box, Flex, FlexProps, Text } from "@chakra-ui/layout";
import { IMessage } from "../@types/message";
import dayjs from "dayjs";
import env from "config/env";
import ChatName from "domains/public/components/chat/ChatName";

interface IProps {
    message: IMessage;
    index: number;
}

function formatTimestamp(date: Date) {
    return dayjs(date).format("HH:mm");
}

export default function ChatMessage({ message, index }: IProps) {
    const notSentStyling: FlexProps = message.notSent
        ? {
              opacity: 0.25,
              userSelect: "none",
          }
        : {};

    const serverMessageStyling = message.serverMessage
        ? {
              fontStyle: "italic",
              color: "textMuted",
          }
        : {};

    return (
        <Flex
            wordBreak="break-word"
            alignItems="center"
            py="0.5rem"
            px="1rem"
            _odd={{ bgColor: "gray.400" }}
            _even={{ bgColor: "gray.600" }}
            boxShadow="elevate.bottom"
            zIndex={env.ROOM_MAX_MESSAGES - index}
            {...notSentStyling}
        >
            <Box {...serverMessageStyling}>
                <Flex>
                    <Text color="textMuted" as="span" mr="0.25rem">
                        {`${formatTimestamp(message.created_at)} `}
                    </Text>
                    <ChatName socket={message.socket}>
                        {message.serverMessage
                            ? `${message.socket.username} `
                            : `${message.socket.username}: `}
                    </ChatName>
                </Flex>
                <Text as="span">{message.body}</Text>
            </Box>
        </Flex>
    );
}
