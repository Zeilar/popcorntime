import theme from "@chakra-ui/theme";

export const Button = {
    baseStyle: {
        transitionDuration: "0.1s",
        _focus: {
            boxShadow: "none",
        },
    },
    defaultProps: {
        rounded: "base",
    },
    variants: {
        primary: {
            ...theme.components.Button.variants.solid,
            backgroundColor: "brand.default",
            _active: { backgroundColor: "brand.dark" },
        },
    },
};
