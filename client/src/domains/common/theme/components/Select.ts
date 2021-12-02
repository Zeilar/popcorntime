import { StyleConfig } from "@chakra-ui/theme-tools";

export const Select: StyleConfig = {
    baseStyle: {
        field: {
            bgColor: "gray.800",
        },
    },
    variants: {
        filled: {
            field: {
                rounded: "sm",
                _hover: {
                    bgColor: "gray.800",
                    cursor: "pointer",
                },
                _focus: {
                    borderColor: "primary.light",
                    bgColor: "primary.dark",
                },
            },
        },
    },
};
