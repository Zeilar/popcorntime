import theme from "@chakra-ui/theme";
import { StyleConfig } from "@chakra-ui/theme-tools";

export const Input: StyleConfig = {
    variants: {
        unstyled: {
            ...theme.components.Input.variants.unstyled,
            _focus: {
                boxShadow: "none",
            },
        },
    },
};
