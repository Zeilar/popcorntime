import "@fontsource/roboto/400.css";
import "@fontsource/open-sans/600.css";
import "@fontsource/poppins/600.css";
import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const colors: Record<string, string> = {
    brand: "#9c162c",
    "brand.light": "#da455e",
    "brand.dark": "#7d1123",
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
                backgroundColor: "brand",
                color: "whiteAlpha.900",
            },
            body: {
                height: "100vh",
                backgroundColor: "black",
                overflow: "hidden",
                "::-webkit-scrollbar-thumb": {
                    backgroundColor: colors.brand,
                    backgroundClip: "padding-box",
                    border: "4px solid transparent",
                    borderRadius: 100,
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
            ".custom-scrollbar::-webkit-scrollbar-thumb": {
                backgroundColor: colors.brand,
                backgroundClip: "padding-box",
                border: "4px solid transparent",
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
