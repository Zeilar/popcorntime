import { StyleConfig } from "@chakra-ui/theme-tools";

export const Button: StyleConfig = {
    baseStyle: {
        height: "revert",
        fontFamily: "Poppins",
        transitionDuration: "0.1s",
        rounded: "sm",
        pos: "relative",
        _focus: {
            boxShadow: "outline",
        },
    },
    sizes: {
        md: {
            paddingInline: 0,
            p: "0.5rem",
        },
    },
    variants: {
        primary: {
            bgColor: "primary.dark",
            color: "primary.light",
            boxShadow: "elevate.all",
        },
        secondary: {
            paddingInline: "0",
            border: "2px solid",
            borderColor: "primary.light",
            color: "primary.light",
            textTransform: "uppercase",
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
            px: "0.5rem",
            textTransform: "uppercase",
        },
        ghost: {
            p: "0.5rem",
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
