import { Button, ButtonProps } from "@chakra-ui/button";
import { ReactNode, Fragment } from "react";
import * as MdiIcons from "@mdi/js";
import { Tooltip } from "@chakra-ui/tooltip";
import { IconProps } from "@chakra-ui/icons";
import { ComponentWithAs } from "@chakra-ui/react";
import MdiIcon from "../../MdiIcon";

interface IProps extends ButtonProps {
    children?: ReactNode;
    mdi?: keyof typeof MdiIcons;
    chakra?: ComponentWithAs<"svg", IconProps>;
    tooltip?: string;
}

export function IconButton({ children, mdi, tooltip, ...props }: IProps) {
    const Wrapper = tooltip ? Tooltip : Fragment;
    const tooltipProps: any = tooltip
        ? { label: tooltip, placement: "top", hasArrow: true }
        : {};
    return (
        <Wrapper {...tooltipProps}>
            <Button
                display="flex"
                alignItems="center"
                justifyContent="center"
                variant="ghost"
                minW="auto"
                p={0}
                w="2rem"
                h="2rem"
                {...props}
            >
                {mdi && (
                    <MdiIcon w="1.25rem" h="1.25rem" maxW="75%" path={mdi} />
                )}
                {children}
            </Button>
        </Wrapper>
    );
}
