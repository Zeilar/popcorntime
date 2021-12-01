import { StyleConfig } from "@chakra-ui/theme-tools";
export const Textarea: StyleConfig = {
    variants: {
        outline: {
            field: {
                _focus: {
                    borderColor: "var(--chakra-colors-secondary-light)",
                    boxShadow: "0 0 0 1px var(--chakra-colors-secondary-light)",
                },
            },
            _focus: {
                borderColor: "var(--chakra-colors-secondary-light)",
                boxShadow: "0 0 0 1px var(--chakra-colors-secondary-light)",
            },
        },
    },
};
