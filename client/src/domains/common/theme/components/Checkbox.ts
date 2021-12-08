import { StyleConfig } from "@chakra-ui/theme-tools";

export const Checkbox: StyleConfig = {
    sizes: {
        md: {
            control: {
                _focus: {
                    boxShadow: "none",
                },
                _checked: {
                    bgColor: "primary.light",
                    borderColor: "primary.light",
                },
            },
        },
    },
};
