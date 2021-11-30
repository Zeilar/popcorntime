import { StyleConfig } from "@chakra-ui/theme-tools";
import { colors } from "../colors";

export const Input: StyleConfig = {
    variants: {
        outline: {
            field: {
                _focus: {
                    borderColor: colors.secondary.light,
                    boxShadow: `0 0 0 1px ${colors.secondary.light}`,
                },
            },
        },
    },
};
