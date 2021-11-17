import { Flex, FlexProps, Text } from "@chakra-ui/layout";
import { motion } from "framer-motion";
import { useContext } from "react";
import { IMessage } from "../@types/message";
import { WebsocketContext } from "../contexts";

interface IProps {
    message: IMessage;
}

const Motion = motion<FlexProps>(Flex);

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

    return (
        <Motion
            alignItems="center"
            p="0.5rem"
            _odd={{ bgColor: "gray.500" }}
            bgColor="gray.700"
            {...notSentStyling}
            {...animationStyling}
        >
            <Text fontStyle={message.serverMessage ? "italic" : undefined}>
                <Text as="span" color={`${message.socket.color}.600`}>
                    {message.serverMessage
                        ? `${message.socket.username} `
                        : `${message.socket.username}: `}
                </Text>
                {message.body}
            </Text>
        </Motion>
    );
}
