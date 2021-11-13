import { extendTheme } from "@chakra-ui/react";
import { colors } from "./colors";
import { components } from "./components";
import { config } from "./config";
import { fonts } from "./fonts";
import { shadows } from "./shadows";

console.log({
    config,
    colors,
    shadows,
    fonts,
    components,
});

export default extendTheme({
    config,
    colors,
    shadows,
    fonts,
    components,
    styles: {
        global: {
            "::selection": {
                backgroundColor: "brand.default",
                color: "inherit",
            },
            body: {
                height: "100vh",
                backgroundColor: "black",
                overflow: "hidden",
                "::-webkit-scrollbar-thumb": {
                    backgroundColor: "brand.default",
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
                width: "1.2rem",
            },
            ".custom-scrollbar::-webkit-scrollbar-thumb": {
                backgroundColor: "brand.default",
                borderRadius: 100,
            },
            ".scrollbar-inset::-webkit-scrollbar-thumb": {
                backgroundClip: "padding-box",
                border: "4px solid transparent",
            },
            h1: {
                fontSize: "5xl",
            },
            h2: {
                fontSize: "3xl",
            },
            h3: {
                fontSize: "2xl",
            },
            h4: {
                fontSize: "xl",
            },
            h5: {
                fontSize: "lg",
            },
            h6: {
                fontSize: "md",
            },
        },
    },
});
