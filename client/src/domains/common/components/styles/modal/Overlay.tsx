import {
    ModalOverlayProps,
    ModalOverlay as ChakraModalOverlay,
} from "@chakra-ui/modal";

export default function ModalOverlay(props: ModalOverlayProps) {
    return <ChakraModalOverlay {...props} />;
}
