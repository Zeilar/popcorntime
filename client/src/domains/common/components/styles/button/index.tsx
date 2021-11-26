import { ColorButton } from "./Color";
import { IconButton } from "./Icon";
import { PrimaryButton } from "./Primary";
import { UnstyledButton } from "./Unstyled";
import { GhostButton } from "./Ghost";

const Button = () => null;
Button.Icon = IconButton;
Button.Primary = PrimaryButton;
Button.Color = ColorButton;
Button.Unstyled = UnstyledButton;
Button.Ghost = GhostButton;

export default Button;
