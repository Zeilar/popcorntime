import { StyleConfig } from "@chakra-ui/theme-tools";

export const Modal: StyleConfig = {
    baseStyle: {
        dialog: {
            bgColor: "gray.600",
            p: "1.5rem",
            boxShadow: "xl",
            rounded: "sm",
            w: "fit-content",
        },
        header: {
            p: 0,
            mb: "0.5rem",
        },
        body: {
            p: 0,
        },
        footer: {
            justifyContent: "flex-start",
            mt: "1.5rem",
            p: 0,
        },
    },
};
