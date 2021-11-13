import { Button, ButtonProps } from "@chakra-ui/button";
import { ReactNode } from "react";

interface IProps extends ButtonProps {
    children: ReactNode;
}

export function PrimaryButton({ children, ...props }: IProps) {
    return (
        <Button {...props} variant="primary">
            {children}
        </Button>
    );
}
