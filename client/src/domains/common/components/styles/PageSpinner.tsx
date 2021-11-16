import { Flex, FlexProps, Text } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import { motion } from "framer-motion";

export default function PageSpinner() {
    const Motion = motion<FlexProps>(Flex);
    return (
        <Motion
            h="100%"
            w="100%"
            pos="fixed"
            zIndex={1000}
            backdropFilter="blur(3px)"
            bgColor="blackAlpha.700"
            left={0}
            top={0}
            justify="center"
            align="center"
            flexDir="column"
            exit={{ opacity: 0 }}
        >
            <Spinner color="brand.default" size="xl" zIndex={100000} />
            <Text mt="1rem">Connecting...</Text>
        </Motion>
    );
}
