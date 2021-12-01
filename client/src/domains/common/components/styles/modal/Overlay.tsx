import { Box, BoxProps } from "@chakra-ui/layout";

interface IModalOverlayProps extends BoxProps {
    allowClickThrough?: boolean;
}

export default function ModalOverlay({
    allowClickThrough,
    children,
    ...props
}: IModalOverlayProps) {
    return (
        <Box
            pointerEvents={allowClickThrough ? "none" : undefined}
            bgColor="blackAlpha.600"
            pos="fixed"
            w="100%"
            h="100%"
            inset={0}
            {...props}
        >
            {children}
        </Box>
    );
}
