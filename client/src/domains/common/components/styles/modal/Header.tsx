import {
    ModalHeaderProps,
    ModalHeader as ChakraModalHeader,
} from "@chakra-ui/modal";

export default function ModalHeader(props: ModalHeaderProps) {
    return <ChakraModalHeader mb="1rem" {...props} />;
}
