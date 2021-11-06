import { Color } from "common/@types/color";
import { Box, BoxProps } from "@chakra-ui/layout";
import { useContext } from "react";
import theme from "@chakra-ui/theme";
import { socket } from "domains/public/config/socket";
import { MeContext } from "domains/public/contexts";

interface IProps extends BoxProps {
    color: Color;
}

export function ColorButton({ children, color, ...props }: IProps) {
    const { me } = useContext(MeContext);

    function clickHandler() {
        socket.emit("socket:update:color", color);
    }

    return (
        <Box
            onClick={clickHandler}
            as="button"
            rounded="full"
            h="2rem"
            w="2rem"
            transition="0.25s"
            border="1px solid"
            borderColor={`${color}.600`}
            bgColor={`${color}.600`}
            _hover={{ backgroundColor: `${color}.500` }}
            _active={{ backgroundColor: `${color}.500` }}
            boxShadow={
                me.color === color
                    ? `0 0 0 2px ${theme.colors[color]["300"]}`
                    : undefined
            }
            {...props}
        />
    );
}
