import { Flex, Text } from "@chakra-ui/layout";

interface IDetailProps {
    label: string;
    value: JSX.Element | string;
}

export function Detail({ label, value }: IDetailProps) {
    return (
        <Flex flexDir="column">
            <Text textTransform="uppercase" color="textMuted">
                {label}
            </Text>
            <Text>{value}</Text>
        </Flex>
    );
}
