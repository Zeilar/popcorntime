import { ButtonProps } from "@chakra-ui/button";
import { ReactNode } from "react";
import * as MdiIcons from "@mdi/js";
import MdiIcon from "@mdi/react";
import Button from "./";
import Icon from "@chakra-ui/icon";

interface IProps extends ButtonProps {
    children?: ReactNode;
    icon?: keyof typeof MdiIcons;
}

export function IconButton({ children, icon, ...props }: IProps) {
    return (
        <Button.Ghost
            display="flex"
            alignItems="center"
            justifyContent="center"
            minW="auto"
            p={0}
            w="2rem"
            h="2rem"
            {...props}
        >
            {icon && (
                <Icon
                    w="1.5rem"
                    h="1.5rem"
                    as={MdiIcon}
                    path={MdiIcons[icon]}
                />
            )}
            {children}
        </Button.Ghost>
    );
}
