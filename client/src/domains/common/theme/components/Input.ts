import { StyleConfig } from "@chakra-ui/theme-tools";

export const Input: StyleConfig = {
    baseStyle: {
        field: {
            boxShadow: "elevate.all",
        },
    },
    variants: {
        filled: {
            field: {
                bgColor: "primary.dark",
                rounded: "sm",
                _hover: {
                    bgColor: "primary.dark",
                },
                _focus: {
                    bgColor: "primary.darkest",
                    borderColor: "primary.light",
                },
            },
        },
        outline: {
            field: {
                rounded: "sm",
                _focus: {
                    borderColor: "primary.light",
                    boxShadow: "0 0 0 1px var(--chakra-colors-primary-light)",
                },
            },
        },
        flushed: {
            rounded: "sm",
            field: {
                borderColor: "transparent",
                _focus: {
                    borderColor: "primary.light",
                    boxShadow: "none",
                },
            },
        },
    },
};
