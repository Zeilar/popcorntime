import "@fontsource/roboto/400.css";
import "@fontsource/open-sans/600.css";
import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const colors: Record<string, string> = {
    brand: "#2F855A",
    "brand.light": "#33915f",
    "brand.dark": "#276749",
};

const config: ThemeConfig = {
    initialColorMode: "dark",
    useSystemColorMode: false,
};

export const theme = extendTheme({
    config,
    colors,
    styles: {
        global: {
            "::selection": {
                backgroundColor: "blackAlpha.500",
                color: colors.brand,
            },
            body: {
                height: "100vh",
                backgroundColor: "gray.900",
                overflow: "hidden",
                "::-webkit-scrollbar-thumb": {
                    backgroundClip: "padding-box",
                    border: "4px solid transparent",
                },
            },
            "#root": {
                height: "100%",
                display: "flex",
            },
            "img, svg, ::placeholder": {
                userSelect: "none",
            },
            "::-webkit-scrollbar": {
                width: "0.9rem",
                height: "0.5rem",
            },
            "::-webkit-scrollbar-thumb": {
                backgroundColor: colors.brand,
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
    fonts: {
        heading: "Open Sans",
        body: "Roboto",
    },
});
