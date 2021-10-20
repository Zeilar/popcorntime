import "@fontsource/roboto/400.css";
import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const colors = {
    accent: "#47daff",
};

const config: ThemeConfig = {
    initialColorMode: "dark",
    useSystemColorMode: false,
};

export const theme = extendTheme({
    config,
    components: {
        Link: {
            baseStyle: {
                ":focus": {
                    boxShadow: "none",
                },
            },
        },
    },
    styles: {
        global: {
            "::selection": {
                backgroundColor: "blackAlpha.500",
                color: colors.accent,
            },
            body: {
                backgroundColor: "gray.900",
                overflowY: "overlay",
                overflowX: "hidden",
                "::-webkit-scrollbar-thumb": {
                    backgroundClip: "padding-box",
                    border: "4px solid transparent",
                },
            },
            button: {
                outline: 0,
            },
            "img, svg, ::placeholder": {
                userSelect: "none",
            },
            "::-webkit-scrollbar": {
                width: "0.9rem",
                height: "0.5rem",
            },
            "::-webkit-scrollbar-thumb": {
                backgroundColor: colors.accent,
                borderRadius: 100,
            },
        },
    },
    shadows: {
        sm: "0 0 3px 0 rgba(0, 0, 0, 0.1)",
        md: "0 0 5px 0 rgba(0, 0, 0, 0.25)",
        lg: "0 0 8px 0 rgba(0, 0, 0, 0.5)",
        xl: "0 0 12px 0 rgba(0, 0, 0, 0.75)",
    },
    colors,
    fonts: {
        heading: "Open Sans",
        body: "Roboto",
    },
});
