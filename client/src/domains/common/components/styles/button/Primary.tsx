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
            bgImage={`linear-gradient(0deg, ${theme.colors.brand} 0%, ${theme.colors["brand.light"]} 100%);`}
            _hover={{ backgroundColor: "brand.light" }}
            _active={{ backgroundColor: "brand.light" }}
            _focus={{ boxShadow: `0 0 0 3px ${theme.colors["brand.dark"]}` }}
            {...props}
        >
            {children}
        </Button>
    );
}
