import { TextProps, Text } from "@chakra-ui/layout";

export default function ModalHeader(props: TextProps) {
    return <Text mb="1rem" as="h2" {...props} />;
}
