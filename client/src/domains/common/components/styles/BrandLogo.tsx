import Icon from "@chakra-ui/icon";
import { Flex, Text } from "@chakra-ui/layout";
import { ReactComponent as PopcornIcon } from "domains/common/svg/popcorn.svg";

export default function BrandLogo() {
    return (
        <Flex
            align="flex-end"
            pos="relative"
            w="fit-content"
            minH="6rem"
            userSelect="none"
        >
            <Flex
                pos="relative"
                bgColor="brand.default"
                align="center"
                rounded="base"
                px="0.5rem"
            >
                <Text p="0.25rem" minW="15rem" rounded="base" fontSize="1.5rem">
                    PopcornTime
                </Text>
                <Icon
                    pos="absolute"
                    right="-1rem"
                    bottom={0}
                    w="8rem"
                    h="8rem"
                    as={PopcornIcon}
                />
            </Flex>
        </Flex>
    );
}
