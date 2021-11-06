import { Button, ButtonProps } from "@chakra-ui/button";
import { useTheme } from "@chakra-ui/react";
import { ReactNode } from "react";

interface IProps extends ButtonProps {
    children: ReactNode;
}

export function PrimaryButton({ children, ...props }: IProps) {
    const theme = useTheme();
    return (
        <Button
            variant="solid"
            bgColor="brand"
            backgroundColor="brand.dark"
            transition="0.1s"
            _hover={{ backgroundColor: "brand.dark" }}
            _active={{ backgroundColor: "brand.default" }}
            _focus={{ boxShadow: `0 0 0 3px ${theme.colors["brand.dark"]}` }}
            {...props}
        >
            {children}
        </Button>
    );
}
