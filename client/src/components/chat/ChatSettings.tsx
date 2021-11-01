import { Flex, FlexProps, Grid, Text } from "@chakra-ui/layout";
import { Divider } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { colors } from "../../data/colors";
import Button from "../styles/button";

const MotionBox = motion<FlexProps>(Flex);

export function ChatSettings() {
    return (
        <MotionBox
            flexDir="column"
            pos="absolute"
            top="-1rem"
            right={0}
            bgColor="gray.800"
            borderRadius="base"
            p="1rem"
            transition={{ duration: "0.15" }}
            animate={{
                opacity: [0.5, 1],
                transform: ["translateY(-95%)", "translateY(-100%)"],
            }}
        >
            <Text size="lg">Color</Text>
            <Divider my="1rem" />
            <Grid gridTemplateColumns="repeat(4, 2rem)" gridGap="0.5rem">
                {colors.map((color) => (
                    <Button.Color key={color} color={color} />
                ))}
            </Grid>
        </MotionBox>
    );
}
