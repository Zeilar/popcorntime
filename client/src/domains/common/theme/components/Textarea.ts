import { StyleConfig } from "@chakra-ui/theme-tools";
export const Textarea: StyleConfig = {
    variants: {
        filled: {
            bgColor: "gray.800",
            _hover: {
                bgColor: "gray.800",
            },
            _focus: {
                bgColor: "primary.dark",
                borderColor: "primary.light",
                boxShadow: "0 0 0 1px var(--chakra-colors-primary-light)",
            },
        },
    },
};
