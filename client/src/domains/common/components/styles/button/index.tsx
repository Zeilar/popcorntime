import { ColorButton } from "./Color";
import { IconButton } from "./Icon";
import { Button as ChakraButton, ButtonProps } from "@chakra-ui/button";

export default function Button({ children, ...props }: ButtonProps) {
    return <ChakraButton {...props}>{children}</ChakraButton>;
}
Button.Icon = IconButton;
Button.Color = ColorButton;
