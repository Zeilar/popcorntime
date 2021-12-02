import { StyleConfig } from "@chakra-ui/theme-tools";

export const Link: StyleConfig = {
    baseStyle: {
        transition: "none",
        color: "red",
        _focus: {
            boxShadow: "none",
            outlineColor: "primary.light",
        },
    },
};
