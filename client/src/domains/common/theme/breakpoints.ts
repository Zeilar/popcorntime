import {
    createBreakpoints,
    BaseBreakpointConfig,
} from "@chakra-ui/theme-tools";

const MAX_MOBILE_SIZE = "1600px";

export const breakpoints: BaseBreakpointConfig = createBreakpoints({
    sm: MAX_MOBILE_SIZE,
    md: MAX_MOBILE_SIZE,
    lg: MAX_MOBILE_SIZE,
    xl: MAX_MOBILE_SIZE,
    "2xl": MAX_MOBILE_SIZE,
    desktop: MAX_MOBILE_SIZE,
});
