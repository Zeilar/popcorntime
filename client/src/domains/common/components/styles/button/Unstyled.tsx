import { Button, ButtonProps } from "@chakra-ui/button";
import { ReactNode } from "react";

interface IProps extends ButtonProps {
    children: ReactNode;
}

export function UnstyledButton({ children, ...props }: IProps) {
    return (
        <Button variant="unstyled" {...props}>
            {children}
        </Button>
    );
}
