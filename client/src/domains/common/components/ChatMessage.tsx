import { Flex, FlexProps, Text } from "@chakra-ui/layout";
import { motion } from "framer-motion";
import { useContext } from "react";
import { IMessage } from "../@types/message";
import { WebsocketContext } from "../contexts";
import SocketAvatar from "./styles/SocketAvatar";

interface IProps {
    message: IMessage;
}

const MotionBox = motion<FlexProps>(Flex);

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

    const textAutomaticStyling: any = message.serverMessage
        ? {
              fontStyle: "italic",
              userSelect: "none",
              color: "GrayText",
          }
        : {};

    return (
        <MotionBox
            borderRadius={4}
            alignItems="center"
            p="0.5rem"
            mt={1}
            _first={{ marginTop: 0 }}
            bgColor={message.serverMessage ? "gray.600" : undefined}
            bgGradient={
                message.serverMessage
                    ? "none"
                    : `linear(to-r, ${message.socket.color}.800, ${message.socket.color}.900)`
            }
            {...notSentStyling}
            {...animationStyling}
        >
            <SocketAvatar
                mr="1rem"
                socket={message.socket}
                w="2.5rem"
                h="2.5rem"
            />
            <Text {...textAutomaticStyling}>{message.body}</Text>
        </MotionBox>
    );
}
