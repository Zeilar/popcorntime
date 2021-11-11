import { AbsoluteCenter, Box, Flex, FlexProps, Text } from "@chakra-ui/layout";
import { Tooltip } from "@chakra-ui/react";
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

    const { color } = message.socket;

    return (
        <MotionBox
            {...notSentStyling}
            {...animationStyling}
            borderRadius={4}
            alignItems="center"
            p="0.5rem"
            mt={1}
            _first={{ marginTop: 0 }}
            bgGradient={`linear(to-r, ${color}.800, ${color}.900)`}
        >
            <SocketAvatar mr="1rem" socket={message.socket} />
            <Text fontStyle={message.automatic ? "italic" : "normal"}>
                {message.body}
            </Text>
        </MotionBox>
    );
}
