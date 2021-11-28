import { ColorButton } from "./Color";
import { IconButton } from "./Icon";
import { PrimaryButton } from "./Primary";
import { UnstyledButton } from "./Unstyled";
import { GhostButton } from "./Ghost";
import { SecondaryButton } from "./Secondary";

const Button = () => null;
Button.Icon = IconButton;
Button.Primary = PrimaryButton;
Button.Secondary = SecondaryButton;
Button.Color = ColorButton;
Button.Unstyled = UnstyledButton;
Button.Ghost = GhostButton;

export default Button;
