import { Color } from "domains/common/@types/color";
import { useContext } from "react";
import { MeContext } from "domains/public/contexts";
import { WebsocketContext } from "domains/public/contexts";
import { Box, BoxProps } from "@chakra-ui/layout";

interface IProps extends BoxProps {
    color: Color;
}

export function ColorButton({ children, color, ...props }: IProps) {
    const { me } = useContext(MeContext);
    const { publicSocket } = useContext(WebsocketContext);

    const active = me?.color === color;

    function setColor() {
        if (active) {
            return;
        }
        publicSocket.emit("socket:update:color", color);
    }

    return (
        <Box
            onClick={setColor}
            as="button"
            rounded="full"
            w="100%"
            sx={{ aspectRatio: "1/1" }}
            transition="0.15s"
            bgColor={`${color}.600`}
            _hover={{ bgColor: !active ? `${color}.500` : undefined }}
            boxShadow={
                active
                    ? `0 0 0 2px var(--chakra-colors-whiteAlpha-900)`
                    : undefined
            }
            {...props}
        />
    );
}
