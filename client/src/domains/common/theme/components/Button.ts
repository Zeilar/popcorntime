import theme from "@chakra-ui/theme";
import { StyleConfig } from "@chakra-ui/theme-tools";

export const Button: StyleConfig = {
    baseStyle: {
        transitionDuration: "0.1s",
        pos: "relative",
        _focus: {
            boxShadow: "none",
        },
    },
    variants: {
        primary: {
            ...theme.components.Button.variants.solid,
            backgroundColor: "brand.default",
            px: "2rem",
            py: "1rem",
            overflow: "hidden",
            transitionDuration: "0.25s",
            _focus: {
                boxShadow: "0 0 0 2px var(--chakra-colors-brand-light)",
            },
        },
        secondary: {
            bgColor: "secondary.dark",
            color: "secondary.light",
            px: "2rem",
            py: "1rem",
            _focus: {
                boxShadow: "0 0 0 2px var(--chakra-colors-secondary-light)",
            },
        },
        ghost: {
            _focus: {
                boxShadow: "0 0 0 2px var(--chakra-colors-secondary-light)",
            },
        },
    },
};
