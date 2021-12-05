import { Box, BoxProps } from "@chakra-ui/layout";

interface IModalOverlayProps {
    allowClickThrough?: boolean;
    isOpen?: boolean;
    style?: BoxProps;
    children?: React.ReactNode;
}

export default function ModalOverlay({
    allowClickThrough,
    children,
    isOpen,
    style,
}: IModalOverlayProps) {
    return isOpen ? (
        <Box
            pointerEvents={allowClickThrough ? "none" : undefined}
            bgColor="blackAlpha.600"
            pos="fixed"
            w="100%"
            h="100%"
            inset={0}
            backdropFilter="blur(2px)"
            zIndex={1000}
            {...style}
        >
            {children}
        </Box>
    ) : null;
}
