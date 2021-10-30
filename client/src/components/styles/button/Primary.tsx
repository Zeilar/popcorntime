import { Button, ButtonProps } from "@chakra-ui/button";
import { ReactNode } from "react";
import { theme } from "../../../styles/theme";

interface IProps extends ButtonProps {
    children: ReactNode;
}

export function PrimaryButton({ children, ...props }: IProps) {
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
