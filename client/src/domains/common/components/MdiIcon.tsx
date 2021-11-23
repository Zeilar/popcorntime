import { IconProps, Icon as ChakraIcon } from "@chakra-ui/icon";
import * as MdiIcons from "@mdi/js";
import Icon from "@mdi/react";

interface IProps extends IconProps {
    path: keyof typeof MdiIcons;
}

export default function MdiIcon({ path, ...props }: IProps) {
    return (
        <ChakraIcon
            as={Icon}
            path={MdiIcons[path]}
            w="1.5rem"
            h="1.5rem"
            {...props}
        />
    );
}
