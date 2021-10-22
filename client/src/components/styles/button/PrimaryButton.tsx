import { Button, ButtonProps } from "@chakra-ui/button";
import { ReactNode } from "react";
import { theme } from "../../../styles/theme";

interface Props extends ButtonProps {
    children: ReactNode;
}

export function PrimaryButton({ children, ...props }: Props) {
    return (
        <Button
            variant="solid"
            backgroundColor="brand"
            _hover={{ backgroundColor: "brand.light" }}
            _active={{ backgroundColor: "brand.light" }}
            _focus={{ boxShadow: `0 0 0 3px ${theme.colors["brand.dark"]}` }}
            {...props}
        >
            {children}
        </Button>
    );
}
