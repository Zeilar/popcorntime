import { Flex, FlexProps } from "@chakra-ui/layout";
import { AbsoluteCenter, Text } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/spinner";
import { motion } from "framer-motion";

export default function PageSpinner() {
    const Motion = motion<FlexProps>(Flex);
    return (
        <Motion
            h="100%"
            w="100%"
            pos="fixed"
            zIndex={100000}
            backdropFilter="blur(3px)"
            bgColor="blackAlpha.700"
            left={0}
            top={0}
            justify="center"
            align="center"
            flexDir="column"
            exit={{ opacity: 0 }}
        >
            <AbsoluteCenter as={Flex} alignItems="center" flexDir="column">
                <Spinner color="brand.default" size="xl" zIndex={1000} />
                <Text textAlign="center" mt="1rem">
                    Connecting...
                </Text>
            </AbsoluteCenter>
        </Motion>
    );
}
