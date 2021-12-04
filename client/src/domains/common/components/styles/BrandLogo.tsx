import Icon from "@chakra-ui/icon";
import { Flex, Text } from "@chakra-ui/layout";
import { ReactComponent as PopcornIcon } from "domains/common/assets/svg/popcorn.svg";

export default function BrandLogo() {
    return (
        <Flex alignItems="center" w="fit-content" minH="3rem" userSelect="none">
            <Flex
                pos="relative"
                bgColor="brand.default"
                alignItems="center"
                rounded="sm"
                py="0.25rem"
                px="0.5rem"
            >
                <Text w="9rem" fontFamily="Poppins">
                    SyncedTube
                </Text>
                <Icon
                    pos="absolute"
                    right="0.25rem"
                    bottom="-0.5rem"
                    w="3rem"
                    h="3rem"
                    as={PopcornIcon}
                />
            </Flex>
        </Flex>
    );
}
