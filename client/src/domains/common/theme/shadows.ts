import { colors } from "./colors";

export const shadows = {
    sm: "0 0 5px 0 rgba(0, 0, 0, 0.15)",
    md: "0 0 10px 0 rgba(0, 0, 0, 0.25)",
    lg: "0 0 8px 0 rgba(0, 0, 0, 0.5)",
    xl: "0 0 12px 0 rgba(0, 0, 0, 0.75)",
    elevate: {
        under: "0 1px 2px 0 rgba(0, 0, 0, 0.75)",
        all: "0 0 3px 0 rgba(0, 0, 0, 0.75)",
    },
    outline: `0 0 0 2px ${colors.brand.light}`,
};
