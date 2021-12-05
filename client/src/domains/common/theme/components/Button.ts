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
            _active: {
                bgColor: "primary.darkest",
            },
            _focus: {
                boxShadow: "0 0 0 2px var(--chakra-colors-primary-light)",
            },
        },
        danger: {
            bgColor: "danger",
            _hover: {
                bgColor: "red.700",
            },
        },
        ghost: {
            _hover: {
                bgColor: "gray.300",
            },
            _active: {
                bgColor: "gray.300",
            },
            _focus: {
                bgColor: "gray.300",
                boxShadow: "0 0 0 2px var(--chakra-colors-primary-light)",
            },
        },
        link: {
            color: "inherit",
            _hover: {
                color: "primary.light",
                textDecor: "none",
            },
            _active: {
                color: "primary.light",
            },
        },
    },
};
