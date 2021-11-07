import Icon from "@chakra-ui/icon";
import { Flex, Text } from "@chakra-ui/layout";
import { ReactComponent as PopcornIcon } from "domains/common/assets/svg/popcorn.svg";

export default function BrandLogo() {
    return (
        <Flex
            align="center"
            pos="relative"
            w="fit-content"
            minH="8rem"
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
                    minW="16rem"
                    rounded="base"
                    fontSize="1.5rem"
                    fontFamily="Poppins"
                >
                    PopcornTime
                </Text>
                <Icon
                    pos="absolute"
                    right={0}
                    bottom="-1.25rem"
                    w="6rem"
                    h="6rem"
                    as={PopcornIcon}
                />
            </Flex>
        </Flex>
    );
}
