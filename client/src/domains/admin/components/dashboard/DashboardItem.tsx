import { Flex } from "@chakra-ui/layout";
import { NavLink, NavLinkProps } from "react-router-dom";
import { Icon } from "@chakra-ui/icons";
import { Icon as MdiIcon } from "@mdi/react";
import * as MdiIcons from "@mdi/js";

interface IProps extends NavLinkProps {
    icon: keyof typeof MdiIcons;
}

export default function DashboardItem({ to, children, icon }: IProps) {
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
            _active={{ bgColor: "gray.300" }}
            _activeLink={{
                bgColor: "brand.default",
            }}
            py="0.75rem"
            px="1rem"
            fontSize="xl"
            borderRadius="base"
            exact
        >
            <Icon as={MdiIcon} path={MdiIcons[icon]} mr="0.5rem" />
            {children}
        </Flex>
    );
}
