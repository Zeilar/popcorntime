import { IconProps } from "@chakra-ui/icon";
import { SettingsIcon } from "@chakra-ui/icons";
import { theme } from "../../../styles/theme";

interface IProps extends IconProps {}

export function Settings({ children, ...props }: IProps) {
    return <SettingsIcon {...props}>{children}</SettingsIcon>;
}
