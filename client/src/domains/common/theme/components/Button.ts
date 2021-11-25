import theme from "@chakra-ui/theme";
import { StyleConfig } from "@chakra-ui/theme-tools";

export const Button: StyleConfig = {
    baseStyle: {
        transitionDuration: "0.1s",
        _focus: {
            boxShadow: "none",
        },
    },
    variants: {
        primary: {
            ...theme.components.Button.variants.solid,
            backgroundColor: "brand.default",
            _active: { backgroundColor: "brand.dark" },
        },
    },
};
