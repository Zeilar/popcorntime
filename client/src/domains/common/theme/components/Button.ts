import { StyleConfig } from "@chakra-ui/theme-tools";

export const Button: StyleConfig = {
    baseStyle: {
        transitionDuration: "0.1s",
        rounded: "sm",
        pos: "relative",
        _focus: {
            boxShadow: "outline",
        },
    },
    variants: {
        primary: {
            bgColor: "primary.dark",
            color: "primary.light",
            px: "2rem",
            py: "1rem",
            boxShadow: "elevate.all",
        },
        secondary: {
            border: "2px solid",
            borderColor: "primary.light",
            color: "primary.light",
            px: "2rem",
            py: "1rem",
            _hover: {
                bgColor: "primary.light",
                color: "black",
            },
            _focus: {
                boxShadow: "none",
            },
        },
        danger: {
            bgColor: "danger",
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
            _focus: {
                boxShadow: "none",
            },
        },
    },
};
