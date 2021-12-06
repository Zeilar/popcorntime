import { StyleConfig } from "@chakra-ui/theme-tools";

export const Select: StyleConfig = {
    baseStyle: {
        field: {
            bgColor: "primary.dark",
            boxShadow: "elevate.all",
        },
    },
    variants: {
        filled: {
            field: {
                rounded: "sm",
                _hover: {
                    bgColor: "primary.dark",
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
