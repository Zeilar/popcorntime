import { Flex, Grid, Text } from "@chakra-ui/layout";
import { Divider } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { colors } from "../../data/colors";
import Button from "../styles/button";

export function ChatSettings() {
    return (
        <Flex
            flexDir="column"
            pos="absolute"
            top="-1rem"
            right={0}
            bgColor="gray.800"
            borderRadius="base"
            transform="translateY(-100%)"
            p="1rem"
        >
            <Text size="lg">Color</Text>
            <Divider my="1rem" />
            <Grid gridTemplateColumns="repeat(4, 2rem)" gridGap="0.5rem">
                {colors.map((color) => (
                    <Button.Color key={color} color={color} />
                ))}
            </Grid>
        </Flex>
    );
}
