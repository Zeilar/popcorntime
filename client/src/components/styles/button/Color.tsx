import { Button, ButtonProps } from "@chakra-ui/button";
import { Color } from "../../../../@types/color";
import { useTheme } from "@emotion/react";

interface IProps extends ButtonProps {
    color: Color;
}

export function ColorButton({ children, color, ...props }: IProps) {
    const theme: any = useTheme();
    console.log(theme.colors[color]);
    return (
        <Button
            w="1rem"
            h="1rem"
            rounded="full"
            border="1px solid"
            borderColor={`${color}.600`}
            bgColor={`${color}.600`}
            _hover={{ backgroundColor: `${color}.500` }}
            _active={{ backgroundColor: `${color}.500` }}
            _focus={{ boxShadow: `0 0 0 3px ${theme.colors[color]["400"]}` }}
            {...props}
        />
    );
}
