import { AbsoluteCenter, Box, Flex, FlexProps, Text } from "@chakra-ui/layout";
import { Tooltip } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { IMessage } from "../@types/message";
import { socket } from "../../public/config/socket";

interface IProps {
    message: IMessage;
}

function abbreviateUsername(username: string) {
    const [adjective, name] = username.split(" ");
    return `${adjective[0]}${name[0]}`;
}

const MotionBox = motion<FlexProps>(Flex);

export default function ChatMessage({ message }: IProps) {
    // Using Chakra FlexProps type for some reason won't work
    const notSentStyling: any = message.notSent
        ? {
              opacity: 0.25,
              userSelect: "none",
          }
        : {};

    // Don't animate user's own messages
    const animationStyling =
        message.socket.id !== socket.id
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
            <Tooltip
                bgGradient={`linear(to-r, ${color}.800, ${color}.900)`}
                label={message.socket.username}
                openDelay={150}
                placement="left"
                fontSize="large"
                fontWeight={600}
                color="inherit"
                mr="0.5rem"
            >
                <Box
                    pos="relative"
                    w="2.5rem"
                    h="2.5rem"
                    mr="1rem"
                    alignSelf="flex-start"
                    flexShrink={0}
                >
                    <AbsoluteCenter
                        w="100%"
                        h="100%"
                        as="span"
                        userSelect="none"
                        rounded="full"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        fontWeight={600}
                        fontFamily="Open Sans"
                        bgColor={`${color}.600`}
                    >
                        {abbreviateUsername(message.socket.username)}
                    </AbsoluteCenter>
                </Box>
            </Tooltip>
            <Text>{message.body}</Text>
        </MotionBox>
    );
}
