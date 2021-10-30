import { AbsoluteCenter, Box, Flex, FlexProps, Text } from "@chakra-ui/layout";
import { Tooltip } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { IMessage } from "../../@types/message";
import { socket } from "./App";

interface IProps {
    message: IMessage;
}

function shortenUsername(username: string) {
    const [adjective, name] = username.split(" ");
    return `${adjective[0]}${name[0]}`;
}

const MotionBox = motion<FlexProps>(Flex);

export default function Message({ message }: IProps) {
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

    return (
        <MotionBox
            {...notSentStyling}
            {...animationStyling}
            borderRadius={4}
            alignItems="center"
            p="0.5rem"
            mt={1}
            _first={{ marginTop: 0 }}
            bgColor={`${message.socket.color}.900`}
        >
            <Tooltip
                label={message.socket.username}
                bgColor="black"
                border="1px solid"
                borderColor={`${message.socket.color}.500`}
                color={`${message.socket.color}.500`}
                openDelay={150}
                placement="left"
                fontSize="large"
                fontWeight={600}
                fontFamily="Poppins"
            >
                <Box
                    pos="relative"
                    w="2.5rem"
                    h="2.5rem"
                    mr="0.5rem"
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
                        bgColor={`${message.socket.color}.600`}
                    >
                        {shortenUsername(message.socket.username)}
                    </AbsoluteCenter>
                </Box>
            </Tooltip>
            <Text>{message.body}</Text>
        </MotionBox>
    );
}
