import { IconProps, Icon as ChakraIcon } from "@chakra-ui/icon";
import * as MdiIcons from "@mdi/js";
import _MdiIcon from "@mdi/react";

interface IProps extends IconProps {
    icon: keyof typeof MdiIcons;
}

export default function MdiIcon({ icon, ...props }: IProps) {
    return (
        <ChakraIcon
            as={_MdiIcon}
            path={MdiIcons[icon]}
            w="1rem"
            h="1rem"
            {...props}
        />
    );
}
