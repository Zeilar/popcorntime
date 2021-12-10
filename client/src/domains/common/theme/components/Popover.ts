import { StyleConfig } from "@chakra-ui/theme-tools";

export const Popover: StyleConfig = {
    baseStyle: {
        // @ts-ignore _focus doesn't work with Chakra's typings for some reason
        content: {
            p: "1rem",
            border: 0,
            boxShadow: "lg",
            rounded: "sm",
            _focus: {
                boxShadow: "lg",
            },
        },
        header: {
            border: 0,
            p: 0,
        },
        body: {
            p: 0,
            rounded: "sm",
        },
    },
};
