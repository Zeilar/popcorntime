import { Flex } from "@chakra-ui/layout";
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
        <Flex
            alignItems="center"
            userSelect="none"
            mb="0.25rem"
            w="100%"
            as={NavLink}
            to={to}
            transition="background-color 0.05s"
            _hover={{ bgColor: "gray.500" }}
            _active={{ bgColor: theme.colors.gray["300"] }}
            _activeLink={{ bgColor: theme.colors.brand["default"] }}
            p="0.75rem"
            fontSize="xl"
            borderRadius="base"
        >
            <Icon
                as={MdiIcon}
                path={MdiIcons[icon]}
                mx="0.5rem"
                w="1rem"
                h="1rem"
            />
            {children}
        </Flex>
    );
}
