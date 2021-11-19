export const styles = {
    global: {
        "::selection": {
            backgroundColor: "black",
            color: "brand.default",
        },
        body: {
            height: "100vh",
            backgroundColor: "gray.700",
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
        "::-webkit-scrollbar-thumb": {
            backgroundClip: "padding-box",
            border: "4px solid transparent",
            backgroundColor: "brand.default",
            borderRadius: 100,
        },
        "::-webkit-scrollbar-track": {
            backgroundColor: "gray.900",
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
        ".chakra-switch": {
            width: "fit-content",
        },
        ".chakra-switch__track": {
            "&[data-checked]": {
                backgroundColor:
                    "var(--chakra-colors-brand-default) !important",
            },
            "&[data-focus]": {
                boxShadow: "none !important",
            },
        },
    },
};
