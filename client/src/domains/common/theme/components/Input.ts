import { StyleConfig } from "@chakra-ui/theme-tools";
import { colors } from "../colors";

export const Input: StyleConfig = {
    variants: {
        outline: {
            field: {
                _focus: {
                    borderColor: "secondary.light",
                    boxShadow: `0 0 0 1px ${colors.secondary.light}`,
                },
            },
        },
        flushed: {
            field: {
                borderColor: "transparent",
                _focus: {
                    borderColor: "secondary.light",
                    boxShadow: `0 1px 0 0 ${colors.secondary.light}`,
                },
            },
        },
    },
};
