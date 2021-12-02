import Icon from "@chakra-ui/icon";
import { Flex, Text } from "@chakra-ui/layout";
import { ReactComponent as PopcornIcon } from "domains/common/assets/svg/popcorn.svg";

export default function BrandLogo() {
    return (
        <Flex alignItems="center" w="fit-content" minH="4rem" userSelect="none">
            <Flex
                pos="relative"
                bgColor="brand.default"
                alignItems="center"
                rounded="base"
                px="0.5rem"
            >
                <Text
                    p="0.25rem"
                    w="12rem"
                    rounded="base"
                    fontSize="1.25rem"
                    fontFamily="Poppins"
                >
                    SyncedTube
                </Text>
                <Icon
                    pos="absolute"
                    right="0.25rem"
                    bottom="-0.5rem"
                    w="4rem"
                    h="4rem"
                    as={PopcornIcon}
                />
            </Flex>
        </Flex>
    );
}
