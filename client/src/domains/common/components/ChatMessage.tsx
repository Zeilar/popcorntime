import { Flex, FlexProps, Text } from "@chakra-ui/layout";
import { motion } from "framer-motion";
import { useContext } from "react";
import { IMessage } from "../@types/message";
import { WebsocketContext } from "../contexts";
import dayjs from "dayjs";

interface IProps {
    message: IMessage;
}

const Motion = motion<FlexProps>(Flex);

function formatTimestamp(date: Date) {
    return dayjs(date).format("HH:mm");
}

export default function ChatMessage({ message }: IProps) {
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
            alignItems="center"
            py="0.5rem"
            px="1rem"
            _odd={{ bgColor: "gray.400" }}
            {...notSentStyling}
            {...animationStyling}
        >
            <Text {...serverMessageStyling}>
                <Text color="textMuted" as="span">
                    {`${formatTimestamp(new Date(message.created_at))} `}
                </Text>
                <Text
                    as="span"
                    color={`${message.socket.color}.600`}
                    fontWeight={700}
                >
                    {message.serverMessage
                        ? `${message.socket.username} `
                        : `${message.socket.username}: `}
                </Text>
                {message.body}
            </Text>
        </Motion>
    );
}
