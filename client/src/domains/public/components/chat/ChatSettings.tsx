import { Flex, FlexProps, Text } from "@chakra-ui/layout";
import { Divider, Switch } from "@chakra-ui/react";
import { colors } from "data/colors";
import Button from "domains/common/components/styles/button";
import { useLocalStorage } from "domains/common/hooks";
import { motion } from "framer-motion";

const MotionBox = motion<FlexProps>(Flex);

export function ChatSettings() {
    const [showServerMessages, setShowServerMessages] =
        useLocalStorage<boolean>("showServerMessages:room", true);
    return (
        <MotionBox
            flexDir="column"
            pos="absolute"
            top="-1rem"
            left={0}
            bgColor="gray.900"
            borderRadius="base"
            boxShadow="lg"
            p="1rem"
            zIndex={1000000}
            animate={{
                opacity: [0.5, 1],
                transform: ["translateY(-95%)", "translateY(-100%)"],
                transition: {
                    duration: 0.15,
                },
            }}
        >
            <Text size="lg" mb="0.5rem">
                Color
            </Text>
            <Flex sx={{ gap: "0.5rem" }}>
                {colors.map(color => (
                    <Button.Color key={color} color={color} />
                ))}
            </Flex>
            <Divider my="1rem" />
            <Text size="lg" mb="0.5rem">
                Show server messages
            </Text>
            <Switch
                defaultChecked={showServerMessages ?? true}
                checked={showServerMessages ?? true}
                onChange={e => setShowServerMessages(e.target.checked)}
            />
        </MotionBox>
    );
}
