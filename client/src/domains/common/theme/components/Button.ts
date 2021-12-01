import { StyleConfig } from "@chakra-ui/theme-tools";

export const Button: StyleConfig = {
    baseStyle: {
        transitionDuration: "0.1s",
        rounded: "sm",
        pos: "relative",
        _focus: {
            boxShadow: "none",
        },
    },
    variants: {
        primary: {
            overflow: "hidden",
            bgColor: "primary.dark",
            color: "primary.light",
            px: "2rem",
            py: "1rem",
            _focus: {
                boxShadow: "0 0 0 2px var(--chakra-colors-primary-light)",
            },
        },
        ghost: {
            _focus: {
                boxShadow: "0 0 0 2px var(--chakra-colors-primary-light)",
            },
        },
    },
};
