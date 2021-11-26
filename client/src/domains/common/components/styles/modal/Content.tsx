import {
    ModalContentProps,
    ModalContent as ChakraModalContent,
} from "@chakra-ui/modal";

export default function ModalContent(props: ModalContentProps) {
    return <ChakraModalContent m="1rem" p="2rem" {...props} />;
}
