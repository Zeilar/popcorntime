import { Button, ButtonProps } from "@chakra-ui/button";
import { ReactNode } from "react";
import { theme } from "../../../../../common/styles/theme";

interface IProps extends ButtonProps {
    children: ReactNode;
}

export function IconButton({ children, ...props }: IProps) {
    return (
        <Button
            variant="outline"
            border="1px solid"
            borderColor="brand"
            bgColor="blackAlpha.100"
            _hover={{ backgroundColor: "brand" }}
            _active={{ backgroundColor: "brand" }}
            _focus={{ boxShadow: `0 0 0 3px ${theme.colors["brand.dark"]}` }}
            {...props}
        >
            {children}
        </Button>
    );
}
