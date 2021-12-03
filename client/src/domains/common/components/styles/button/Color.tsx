import { Color } from "domains/common/@types/color";
import { useContext } from "react";
import { MeContext } from "domains/public/contexts";
import { WebsocketContext } from "domains/public/contexts";
import { Button, ButtonProps } from "@chakra-ui/button";

interface IProps extends ButtonProps {
    color: Color;
}

export function ColorButton({ children, color, ...props }: IProps) {
    const { me } = useContext(MeContext);
    const { publicSocket } = useContext(WebsocketContext);

    function setColor() {
        publicSocket.emit("socket:update:color", color);
    }

    const active = me?.color === color;

    return (
        <Button
            variant="unstyled"
            onClick={setColor}
            rounded="sm"
            h="2rem"
            w="2rem"
            minW="unset"
            transition="0.25s"
            bgColor={`${color}.600`}
            _hover={!active ? { bgColor: `${color}.300` } : undefined}
            boxShadow={
                active
                    ? `0 0 0 2px var(--chakra-colors-${color}-300)`
                    : undefined
            }
            {...props}
        />
    );
}
