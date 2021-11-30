import { ColorButton } from "./Color";
import { IconButton } from "./Icon";
import { Button as ChakraButton, ButtonProps } from "@chakra-ui/button";

const Button = (props: ButtonProps) => <ChakraButton {...props} />;
Button.Icon = IconButton;
Button.Color = ColorButton;

export default Button;
