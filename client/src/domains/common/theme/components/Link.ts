import { StyleConfig } from "@chakra-ui/theme-tools";

export const Link: StyleConfig = {
    baseStyle: {
        transition: "none",
        color: "primary.light",
        _focus: {
            boxShadow: "none",
        },
    },
};
