import { extendTheme } from "@chakra-ui/react";
import { colors } from "./colors";
import { components } from "./components";
import { config } from "./config";
import { fonts } from "./fonts";
import { shadows } from "./shadows";
import { styles } from "./styles";
import { globalDefaults } from "./globalDefaults";

export default extendTheme(
    {
        config,
        colors,
        shadows,
        fonts,
        components,
        styles,
    },
    ...globalDefaults
);
