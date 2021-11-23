import Icon from "@chakra-ui/icon";
import { Flex, Text } from "@chakra-ui/layout";
import { ReactComponent as PopcornIcon } from "domains/common/assets/svg/popcorn.svg";

export default function BrandLogo() {
    return (
        <Flex
            align="center"
            pos="relative"
            w="fit-content"
            py="1.5rem"
            userSelect="none"
        >
            <Flex
                pos="relative"
                bgColor="brand.default"
                align="center"
                rounded="base"
                px="0.5rem"
            >
                <Text
                    p="0.25rem"
                    w="10rem"
                    rounded="base"
                    fontSize="1.25rem"
                    fontFamily="Poppins"
                >
                    SyncTube
                </Text>
                <Icon
                    pos="absolute"
                    right="0.15rem"
                    bottom="-0.75rem"
                    w="4rem"
                    h="4rem"
                    as={PopcornIcon}
                />
            </Flex>
        </Flex>
    );
}
