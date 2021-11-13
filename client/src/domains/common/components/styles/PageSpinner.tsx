import { Flex } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";

export default function PageSpinner() {
    return (
        <Flex
            h="100%"
            w="100%"
            pos="fixed"
            zIndex={1000}
            backdropFilter="blur(3px)"
            bgColor="blackAlpha.700"
            left={0}
            top={0}
        >
            <Spinner color="brand.default" size="xl" m="auto" zIndex={100000} />
        </Flex>
    );
}
