import { Box, Flex } from "@chakra-ui/layout";
import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { Icon } from "@chakra-ui/icons";
import { Icon as MdiIcon } from "@mdi/react";
import * as MdiIcons from "@mdi/js";
import { useTheme } from "@chakra-ui/react";

interface IProps {
    to: string;
    children: ReactNode;
    icon: keyof typeof MdiIcons;
}

export default function DashboardItem({ to, children, icon }: IProps) {
    const theme = useTheme();
    return (
        <Flex textAlign="center">
            <Box
                w="100%"
                as={NavLink}
                to={to}
                sx={{ "&.active": { bgColor: theme.colors.gray["600"] } }}
            >
                {children}
            </Box>
            <Icon as={MdiIcon} path={MdiIcons[icon]} w="1rem" h="1rem" />
        </Flex>
    );
}
