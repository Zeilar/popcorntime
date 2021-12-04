import { ColorButton } from "./Color";
import { IconButton } from "./Icon";
import { Button as ChakraButton, ButtonProps } from "@chakra-ui/button";
import { CheckIcon } from "@chakra-ui/icons";

interface IButtonProps extends ButtonProps {
    isSuccess?: boolean | null;
}

export default function Button({
    isSuccess,
    children,
    ...props
}: IButtonProps) {
    return (
        <ChakraButton {...props}>
            {isSuccess ? <CheckIcon /> : children}
        </ChakraButton>
    );
}
Button.Icon = IconButton;
Button.Color = ColorButton;
