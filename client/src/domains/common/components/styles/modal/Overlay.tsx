import { Box, BoxProps } from "@chakra-ui/layout";
import { AnimatePresence, motion } from "framer-motion";

interface IModalOverlayProps extends BoxProps {
    allowClickThrough?: boolean;
    isOpen?: boolean;
}

const Motion = motion<BoxProps>(Box);

export default function ModalOverlay({
    allowClickThrough,
    children,
    isOpen,
    ...props
}: IModalOverlayProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <Motion
                    exit={{ opacity: 0 }}
                    pointerEvents={allowClickThrough ? "none" : undefined}
                    bgColor="blackAlpha.600"
                    pos="fixed"
                    w="100%"
                    h="100%"
                    inset={0}
                    backdropFilter="blur(2px)"
                    zIndex={1000}
                    {...(props as any)}
                >
                    {children}
                </Motion>
            )}
        </AnimatePresence>
    );
}
