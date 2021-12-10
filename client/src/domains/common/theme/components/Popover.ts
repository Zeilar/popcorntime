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
            px: 0,
            pt: 0,
            pb: "1rem",
            mb: "1rem",
            borderBottom: "1px solid",
            borderColor: "inherit",
        },
        body: {
            p: 0,
            rounded: "sm",
        },
    },
};
