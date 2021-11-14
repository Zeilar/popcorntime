import { Button, ButtonProps } from "@chakra-ui/button";
import { ReactNode, Fragment } from "react";
import * as MdiIcons from "@mdi/js";
import MdiIcon from "@mdi/react";
import Icon from "@chakra-ui/icon";
import { Tooltip } from "@chakra-ui/tooltip";

interface IProps extends ButtonProps {
    children?: ReactNode;
    icon?: keyof typeof MdiIcons;
    tooltip?: string;
}

export function IconButton({ children, icon, tooltip, ...props }: IProps) {
    const Wrapper = tooltip ? Tooltip : Fragment;
    const tooltipProps = tooltip ? { label: tooltip } : {};
    return (
        <Wrapper {...tooltipProps}>
            <Button
                display="flex"
                alignItems="center"
                justifyContent="center"
                variant="ghost"
                minW="auto"
                p={0}
                w="2.5rem"
                h="2.5rem"
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
            </Button>
        </Wrapper>
    );
}
