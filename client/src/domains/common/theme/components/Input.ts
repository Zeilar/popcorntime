import { StyleConfig } from "@chakra-ui/theme-tools";

export const Input: StyleConfig = {
    variants: {
        filled: {
            field: {
                bgColor: "gray.800",
                rounded: "sm",
                _hover: {
                    bgColor: "gray.800",
                },
                _focus: {
                    bgColor: "gray.700",
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
