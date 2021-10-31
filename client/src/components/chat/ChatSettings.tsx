import { Flex, Grid, Text } from "@chakra-ui/layout";
import { Divider } from "@chakra-ui/react";
import { useState, useEffect } from "react";
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
            transform="translateY(-100%)"
            p="1rem"
        >
            <Text size="lg">Color</Text>
            <Divider />
            <Grid gridTemplateColumns="repeat(4, 1fr)">
                {colors.map((color) => (
                    <Button.Color color={color} />
                ))}
            </Grid>
        </Flex>
    );
}
