import { Color } from "../../../../../common/@types/color";
import { useTheme } from "@emotion/react";
import { Box, BoxProps } from "@chakra-ui/layout";
import { MeContext } from "../../../contexts";
import { useContext } from "react";
import { socket } from "../../../config/socket";

interface IProps extends BoxProps {
    color: Color;
}

export function ColorButton({ children, color, ...props }: IProps) {
    const theme: any = useTheme();
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
