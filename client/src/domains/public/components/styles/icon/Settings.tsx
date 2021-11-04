import { IconProps } from "@chakra-ui/icon";
import { SettingsIcon } from "@chakra-ui/icons";

interface IProps extends IconProps {}

export function Settings({ children, ...props }: IProps) {
    return <SettingsIcon {...props}>{children}</SettingsIcon>;
}
