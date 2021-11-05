import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const colors = {
    brand: {
        default: "#9c162c",
        light: "#da455e",
        dark: "#7d1123",
    },
    gradient: {
        brand: "linear-gradient(45deg, #7d1123 0%, #da455e 100%)",
    },
    gray: {
        "900": "#141414",
        "800": "#191919",
        "700": "#1e1e1e",
        "600": "#232323",
        "500": "#282828",
        "400": "#2d2d2d",
        "300": "#323232",
        "200": "#373737",
        "100": "#3c3c3c",
    },
};

const config: ThemeConfig = {
    initialColorMode: "dark",
    useSystemColorMode: false,
};

const fonts = {
    heading: "Open Sans",
    body: "Roboto",
};

const shadows = {
    sm: "0 0 3px 0 rgba(0, 0, 0, 0.1)",
    md: "0 0 5px 0 rgba(0, 0, 0, 0.25)",
    lg: "0 0 8px 0 rgba(0, 0, 0, 0.5)",
    xl: "0 0 12px 0 rgba(0, 0, 0, 0.75)",
};

export default extendTheme({
    config,
    colors,
    shadows,
    fonts,
    styles: {
        global: {
            "::selection": {
                backgroundColor: colors.brand.default,
                color: "whiteAlpha.900",
            },
            body: {
                height: "100vh",
                backgroundColor: "black",
                overflow: "hidden",
                "::-webkit-scrollbar-thumb": {
                    backgroundColor: colors.brand.default,
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
                backgroundColor: colors.brand.default,
                backgroundClip: "padding-box",
                border: "4px solid transparent",
                borderRadius: 100,
            },
        },
    },
});
