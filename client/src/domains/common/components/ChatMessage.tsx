import { Box, Flex, FlexProps, Text } from "@chakra-ui/layout";
import { motion } from "framer-motion";
import { useContext } from "react";
import { IMessage } from "../@types/message";
import dayjs from "dayjs";
import env from "config/env";
import ChatName from "domains/public/components/chat/ChatName";
import { WebsocketContext } from "domains/public/contexts";

interface IProps {
    message: IMessage;
    index: number;
}

const Motion = motion<FlexProps>(Flex);

function formatTimestamp(date: Date) {
    return dayjs(date).format("HH:mm");
}

export default function ChatMessage({ message, index }: IProps) {
    const { publicSocket } = useContext(WebsocketContext);

    // Using Chakra FlexProps type for some reason won't work
    const notSentStyling: any = message.notSent
        ? {
              opacity: 0.25,
              userSelect: "none",
          }
        : {};

    // Don't animate user's own messages
    const animationStyling =
        message.socket.id !== publicSocket.id
            ? {
                  animate: {
                      opacity: [0.75, 1],
                  },
                  transition: {
                      duration: 0.25,
                  },
              }
            : {};

    const serverMessageStyling = message.serverMessage
        ? {
              fontStyle: "italic",
              color: "textMuted",
          }
        : {};

    return (
        <Motion
            wordBreak="break-word"
            alignItems="center"
            py="0.5rem"
            px="1rem"
            _odd={{ bgColor: "gray.400" }}
            _even={{ bgColor: "gray.600" }}
            boxShadow="elevate.bottom"
            zIndex={env.ROOM_MAX_MESSAGES - index}
            {...notSentStyling}
            {...animationStyling}
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
        </Motion>
    );
}
