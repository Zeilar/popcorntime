import { AbsoluteCenter, AbsoluteCenterProps } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import { motion } from "framer-motion";

export default function ContainerSpinner() {
    const Motion = motion<AbsoluteCenterProps>(AbsoluteCenter);
    return (
        <Motion
            exit={{ opacity: 0 }}
            w="100%"
            h="100%"
            pos="absolute"
            backdropFilter="blur(3px)"
            zIndex={1000}
        >
            <AbsoluteCenter>
                <Spinner color="brand.default" size="xl" />
            </AbsoluteCenter>
        </Motion>
    );
}
