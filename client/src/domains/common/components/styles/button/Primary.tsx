import { Button, ButtonProps } from "@chakra-ui/button";
import { ReactNode } from "react";

interface IProps extends ButtonProps {
    children: ReactNode;
}

export function PrimaryButton({ children, ...props }: IProps) {
    return (
        <Button
            variant="solid"
            bgColor="brand.default"
            _hover={{ backgroundColor: "brand.default" }}
            _active={{ backgroundColor: "brand.dark" }}
            {...props}
        >
            {children}
        </Button>
    );
}
