import { Button, ButtonProps } from "@chakra-ui/button";
import { useTheme } from "@chakra-ui/react";
import { ReactNode } from "react";

interface IProps extends ButtonProps {
    children: ReactNode;
}

export function IconButton({ children, ...props }: IProps) {
    const theme = useTheme();
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
