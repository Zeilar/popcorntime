import { StyleConfig } from "@chakra-ui/theme-tools";

export const Button: StyleConfig = {
    baseStyle: {
        fontFamily: "Poppins",
        transitionDuration: "0.1s",
        rounded: "sm",
        pos: "relative",
        p: "0.5rem",
        border: "2px solid",
        borderColor: "transparent",
        _focus: {
            boxShadow: "none",
            borderColor: "primary.light",
        },
    },
    sizes: {
        "btn-md": {
            fontSize: "md",
        },
        "btn-lg": {
            paddingX: "1.5rem",
            fontSize: "lg",
        },
    },
    variants: {
        primary: {
            bgColor: "primary.light",
            border: 0,
            color: "black",
            _focus: {
                boxShadow: "none",
            },
        },
        secondary: {
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
        input: {
            bgColor: "primary.dark",
            boxShadow: "elevate.all",
            _focus: {
                bgColor: "primary.darkest",
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
