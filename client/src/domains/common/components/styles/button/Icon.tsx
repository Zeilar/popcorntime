import { ButtonProps } from "@chakra-ui/button";
import { ReactNode } from "react";
import Button from ".";

interface IProps extends ButtonProps {
    children: ReactNode;
}

export function IconButton({ children, ...props }: IProps) {
    return (
        <Button.Ghost
            display="flex"
            alignItems="center"
            justifyContent="center"
            minW="auto"
            p={0}
            w="2rem"
            h="2rem"
            rounded="base"
            {...props}
        >
            {children}
        </Button.Ghost>
    );
}
