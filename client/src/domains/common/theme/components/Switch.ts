import { StyleConfig } from "@chakra-ui/theme-tools";

export const Switch: StyleConfig = {
    variants: {
        filled: {
            w: "fit-content",
            track: {
                _checked: {
                    bgColor: "primary.light",
                },
                _focus: {
                    boxShadow: "none",
                },
            },
        },
    },
};
