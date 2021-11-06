import { ColorButton } from "./Color";
import { IconButton } from "./Icon";
import { PrimaryButton } from "./Primary";

const Button = () => null;
Button.Icon = IconButton;
Button.Primary = PrimaryButton;
Button.Color = ColorButton;

export default Button;
